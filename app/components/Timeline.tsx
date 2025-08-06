import { useState, useRef, useEffect } from "react";
import {
  getContentById,
  getTimelineContent,
  timelineEvents,
  type TimelineEvent,
  type ContentItem,
} from "../config/content";

interface HorizontalTimelineProps {
  visibleElements: Set<string>;
}

export function HorizontalTimeline({
  visibleElements,
}: HorizontalTimelineProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [clickedEvent, setClickedEvent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get timeline items from content
  const timelineItems = getTimelineContent();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timelineRef.current &&
        !timelineRef.current.contains(event.target as Node)
      ) {
        setClickedItem(null);
        setClickedEvent(null);
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startYear = 2019;
  const endYear = 2027;
  const totalYears = endYear - startYear;

  const getEventWidth = (event: TimelineEvent) => {
    // Calculate precise start and end times including months
    const startTime = event.startYear + event.startMonth / 12;
    const endTime = event.endYear
      ? event.endYear + (event.endMonth || 11) / 12
      : endYear + 0.5;
    const duration = endTime - startTime;
    const widthPercentage = (duration / totalYears) * 100;
    return Math.max(Math.min(widthPercentage, 95), 12); // Min 12%, max 95% to prevent overflow
  };

  const getEventLeft = (event: TimelineEvent) => {
    // Calculate precise start time including months
    const startTime = event.startYear + event.startMonth / 12;
    const leftPercentage = ((startTime - startYear) / totalYears) * 100;
    return Math.max(Math.min(leftPercentage, 95), 0); // Clamp between 0 and 95%
  };

  const getItemLeft = (item: ContentItem) => {
    // Parse year and month from date string (e.g., "Jul 2025" -> 2025.5)
    const dateParts = item.date.split(" ");
    const year = parseInt(dateParts.pop() || "2024");
    const monthStr = dateParts[0];

    // Convert month to a decimal fraction of the year for more precise positioning
    const monthMap: { [key: string]: number } = {
      Jan: 0.0,
      Feb: 0.08,
      Mar: 0.17,
      Apr: 0.25,
      May: 0.33,
      Jun: 0.42,
      Jul: 0.5,
      Aug: 0.58,
      Sep: 0.67,
      Oct: 0.75,
      Nov: 0.83,
      Dec: 0.92,
    };

    const monthOffset = monthMap[monthStr] || 0;
    const preciseYear = year + monthOffset;

    const leftPercentage = ((preciseYear - startYear) / totalYears) * 100;
    return Math.max(Math.min(leftPercentage, 95), 0); // Clamp between 0 and 95%
  };

  const showTooltipForElement = (
    elementId: string,
    rect: DOMRect,
    isEvent: boolean = false
  ) => {
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect) return;

    const centerX = rect.left - timelineRect.left + rect.width / 2;
    const containerWidth = timelineRect.width;

    // Adjust tooltip position based on proximity to edges
    let adjustedX = centerX;
    if (centerX < 150) {
      adjustedX = 150;
    } else if (centerX > containerWidth - 150) {
      adjustedX = containerWidth - 150;
    }

    setTooltipPosition({
      x: adjustedX,
      y: rect.top - timelineRect.top - 10,
    });

    if (isEvent) {
      setHoveredEvent(elementId);
      setHoveredItem(null);
    } else {
      setHoveredItem(elementId);
      setHoveredEvent(null);
    }

    setShowTooltip(true);
  };

  const handleItemHover = (item: ContentItem, event: React.MouseEvent) => {
    // Only show hover tooltip on desktop (non-touch devices)
    if (window.matchMedia("(hover: hover)").matches) {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      const rect = event.currentTarget.getBoundingClientRect();
      tooltipTimeoutRef.current = setTimeout(() => {
        showTooltipForElement(item.id, rect, false);
      }, 300);
    }
  };

  const handleEventHover = (
    event: TimelineEvent,
    mouseEvent: React.MouseEvent
  ) => {
    // Only show hover tooltip on desktop (non-touch devices)
    if (window.matchMedia("(hover: hover)").matches) {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }

      const rect = mouseEvent.currentTarget.getBoundingClientRect();
      tooltipTimeoutRef.current = setTimeout(() => {
        showTooltipForElement(event.id, rect, true);
      }, 300);
    }
  };

  const handleItemClick = (item: ContentItem, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // If this item is already clicked, perform the action
    if (clickedItem === item.id) {
      if (item.type === "blog" && item.blogPath) {
        window.location.href = `/content/${item.id}`;
      } else if (item.type === "project" && item.link) {
        window.open(item.link, "_blank");
      } else if (item.githubRepo) {
        window.open(`https://github.com/${item.githubRepo}`, "_blank");
      }
      return;
    }

    // Otherwise, show tooltip
    const rect = event.currentTarget.getBoundingClientRect();
    setClickedItem(item.id);
    setClickedEvent(null);
    showTooltipForElement(item.id, rect, false);
  };

  const handleEventClick = (
    event: TimelineEvent,
    mouseEvent: React.MouseEvent
  ) => {
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();

    // If this event is already clicked, hide tooltip
    if (clickedEvent === event.id) {
      setClickedEvent(null);
      setShowTooltip(false);
      return;
    }

    // Otherwise, show tooltip
    const rect = mouseEvent.currentTarget.getBoundingClientRect();
    setClickedEvent(event.id);
    setClickedItem(null);
    showTooltipForElement(event.id, rect, true);
  };

  const handleMouseLeave = () => {
    // Only hide on mouse leave for desktop
    if (window.matchMedia("(hover: hover)").matches) {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      // Don't hide if clicked item/event is active
      if (!clickedItem && !clickedEvent) {
        setHoveredItem(null);
        setHoveredEvent(null);
        setShowTooltip(false);
      }
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "education":
        return "bg-coral";
      case "work":
        return "bg-jet";
      case "research":
        return "bg-dim-gray";
      default:
        return "bg-coral";
    }
  };

  return (
    <div
      ref={timelineRef}
      id="horizontal-timeline"
      data-animate
      className={`transition-all duration-1000 ${
        visibleElements.has("horizontal-timeline")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-jet rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 border border-dim-gray/20 shadow-2xl">
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center">
          Journey Timeline
        </h3>

        {/* Mobile: Horizontal scroll instruction */}
        <div className="sm:hidden mb-3">
          <p className="text-dim-gray text-xs text-center mb-2">
            ← Scroll horizontally to explore timeline →
          </p>
        </div>

        {/* Timeline container - responsive with better mobile scrolling */}
        <div className="overflow-x-auto sm:overflow-x-visible scrollbar-thin scrollbar-thumb-coral scrollbar-track-night/50">
          <div className="min-w-[700px] sm:min-w-[800px] md:min-w-0">
            {/* Year labels */}
            <div className="relative mb-4 sm:mb-6 md:mb-8">
              <div className="flex justify-between text-xs sm:text-sm text-dim-gray font-medium px-2">
                {Array.from({ length: totalYears + 1 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="mb-1 md:mb-2">{startYear + i}</span>
                    <div className="w-px h-1.5 sm:h-2 md:h-4 bg-dim-gray/40"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline content */}
            <div className="relative bg-night/50 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-6">
              {/* Timeline base line */}
              <div className="absolute top-8 sm:top-10 md:top-12 lg:top-16 left-2 sm:left-3 md:left-6 right-2 sm:right-3 md:right-6 bg-dim-gray/20 rounded-full h-0.5"></div>

              {/* Event bars */}
              <div className="relative h-16 sm:h-20 md:h-24 lg:h-32 mb-0">
                {timelineEvents.map((event, index) => {
                  const verticalOffset = (index % 3) * 8; // Smaller stagger for mobile
                  return (
                    <div
                      key={event.id}
                      className={`absolute h-3 sm:h-4 md:h-5 lg:h-7 ${getEventColor(event.type)} rounded-sm sm:rounded-md md:rounded-lg flex items-center px-1 sm:px-2 md:px-3 text-white text-xs font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      style={{
                        left: `${getEventLeft(event)}%`,
                        width: `${getEventWidth(event)}%`,
                        top: `${0 + verticalOffset}px`,
                        zIndex: 10 + index,
                      }}
                      title={`${event.title} - ${event.subtitle}`}
                      onMouseEnter={(e) => handleEventHover(event, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <span className="truncate text-xs">
                        {window.innerWidth < 640
                          ? event.title.split(" ")[0]
                          : window.innerWidth < 768
                            ? event.title.split(" ").slice(0, 2).join(" ")
                            : event.title}
                      </span>
                      {event.current && (
                        <div className="ml-1 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Interactive dots for projects/blogs */}
              <div className="relative">
                {timelineItems.map((item, index) => {
                  const leftPosition = getItemLeft(item);
                  // Smaller vertical offset for mobile
                  const verticalOffset = index % 2 === 0 ? 0 : 8;

                  return (
                    <div
                      key={item.id}
                      className="absolute w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-white border border-coral sm:border-2 md:border-3 rounded-full cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-xl z-30 flex items-center justify-center"
                      style={{
                        left: `${leftPosition}%`,
                        marginLeft: "-6px", // Half of mobile width
                        top: `${-28 + verticalOffset}px`, // Adjusted for mobile
                      }}
                      onMouseEnter={(e) => handleItemHover(item, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={(e) => handleItemClick(item, e)}
                    >
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-2 md:h-2 bg-coral rounded-full"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-6 justify-center mt-4 sm:mt-6 md:mt-8 p-2 sm:p-3 md:p-4 bg-night/30 rounded-lg sm:rounded-xl md:rounded-2xl">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-coral rounded-sm sm:rounded-md md:rounded-lg shadow-sm"></div>
            <span className="text-xs md:text-sm text-dim-gray font-medium">
              Education
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-jet rounded-sm sm:rounded-md md:rounded-lg shadow-sm"></div>
            <span className="text-xs md:text-sm text-dim-gray font-medium">
              Work
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-dim-gray rounded-sm sm:rounded-md md:rounded-lg shadow-sm"></div>
            <span className="text-xs md:text-sm text-dim-gray font-medium">
              Research
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white border border-coral sm:border-2 rounded-full shadow-sm"></div>
            <span className="text-xs md:text-sm text-dim-gray font-medium">
              Projects & Achievements
            </span>
          </div>
        </div>

        {/* Tooltip */}
        {(hoveredItem || hoveredEvent || clickedItem || clickedEvent) &&
          showTooltip && (
            <div
              className={`absolute bg-night border-2 border-coral rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white text-xs sm:text-sm min-w-40 sm:min-w-48 md:min-w-64 max-w-60 sm:max-w-72 md:max-w-80 z-40 pointer-events-none shadow-2xl backdrop-blur-sm transition-all duration-200 ${
                showTooltip ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: "translate(-50%, -100%)",
              }}
            >
              {(() => {
                const activeItem = hoveredItem || clickedItem;
                const activeEvent = hoveredEvent || clickedEvent;

                if (activeItem) {
                  const item = timelineItems.find((i) => i.id === activeItem);
                  return item ? (
                    <div>
                      <h4 className="font-bold text-coral text-xs sm:text-sm md:text-base mb-1">
                        {item.title}
                      </h4>
                      <p className="text-dim-gray text-xs leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <p className="text-white text-xs font-medium">
                        {clickedItem === item.id
                          ? "Click again to navigate →"
                          : "Click to view details →"}
                      </p>
                    </div>
                  ) : null;
                }

                if (activeEvent) {
                  const event = timelineEvents.find(
                    (e) => e.id === activeEvent
                  );
                  return event ? (
                    <div>
                      <h4 className="font-bold text-coral text-xs sm:text-sm md:text-base mb-1">
                        {event.title}
                      </h4>
                      <p className="text-white text-xs sm:text-sm mb-1">
                        {event.subtitle}
                      </p>
                      <p className="text-dim-gray text-xs leading-relaxed mb-2">
                        {event.description}
                      </p>
                      <p className="text-white text-xs font-medium">
                        {(() => {
                          const monthNames = [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ];
                          const startMonth = monthNames[event.startMonth];
                          const endDisplay =
                            event.endYear && event.endMonth !== undefined
                              ? `${monthNames[event.endMonth]} ${event.endYear}`
                              : "Present";
                          return `${startMonth} ${event.startYear} - ${endDisplay}`;
                        })()}
                      </p>
                      {clickedEvent === event.id && (
                        <p className="text-white text-xs font-medium mt-1">
                          Click again to close
                        </p>
                      )}
                    </div>
                  ) : null;
                }

                return null;
              })()}
            </div>
          )}
      </div>
    </div>
  );
}
