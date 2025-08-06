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

  const startYear = 2019;
  const endYear = 2026;
  const totalYears = endYear - startYear;

  const getEventWidth = (event: TimelineEvent) => {
    const eventEndYear = event.endYear || endYear;
    const duration = eventEndYear - event.startYear;
    const widthPercentage = (duration / totalYears) * 100;
    return Math.max(Math.min(widthPercentage, 95), 12); // Min 12%, max 95% to prevent overflow
  };

  const getEventLeft = (event: TimelineEvent) => {
    const leftPercentage = ((event.startYear - startYear) / totalYears) * 100;
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

  const handleItemHover = (item: ContentItem, event: React.MouseEvent) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    setHoveredItem(item.id);
    const rect = event.currentTarget.getBoundingClientRect();
    const timelineRect = timelineRef.current?.getBoundingClientRect();

    if (timelineRect) {
      const centerX = rect.left - timelineRect.left + rect.width / 2;
      const containerWidth = timelineRect.width;

      // Adjust tooltip position based on proximity to edges
      let adjustedX = centerX;
      if (centerX < 150) {
        // Too close to left edge
        adjustedX = 150;
      } else if (centerX > containerWidth - 150) {
        // Too close to right edge
        adjustedX = containerWidth - 150;
      }

      setTooltipPosition({
        x: adjustedX,
        y: rect.top - timelineRect.top - 10,
      });
    }

    // Add delay before showing tooltip
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleEventHover = (
    event: TimelineEvent,
    mouseEvent: React.MouseEvent
  ) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    setHoveredEvent(event.id);
    const rect = mouseEvent.currentTarget.getBoundingClientRect();
    const timelineRect = timelineRef.current?.getBoundingClientRect();

    if (timelineRect) {
      const centerX = rect.left - timelineRect.left + rect.width / 2;
      const containerWidth = timelineRect.width;

      // Adjust tooltip position based on proximity to edges
      let adjustedX = centerX;
      if (centerX < 150) {
        // Too close to left edge
        adjustedX = 150;
      } else if (centerX > containerWidth - 150) {
        // Too close to right edge
        adjustedX = containerWidth - 150;
      }

      setTooltipPosition({
        x: adjustedX,
        y: rect.top - timelineRect.top - 10,
      });
    }

    // Add delay before showing tooltip
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setHoveredItem(null);
    setHoveredEvent(null);
    setShowTooltip(false);
  };

  const handleItemClick = (item: ContentItem) => {
    if (item.type === "blog" && item.blogPath) {
      window.location.href = `/content/${item.id}`;
    } else if (item.type === "project" && item.link) {
      window.open(item.link, "_blank");
    } else if (item.githubRepo) {
      window.open(`https://github.com/${item.githubRepo}`, "_blank");
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    // Timeline events should not be clickable - removed navigation functionality
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
      <div className="bg-jet rounded-3xl p-8 border border-dim-gray/20 shadow-2xl">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">
          Journey Timeline
        </h3>

        {/* Year labels */}
        <div className="relative mb-8">
          <div className="flex justify-between text-sm text-dim-gray font-medium">
            {Array.from({ length: totalYears + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="mb-2">{startYear + i}</span>
                <div className="w-px h-4 bg-dim-gray/40"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline container */}
        <div className="relative bg-night/50 rounded-2xl p-6">
          {/* Timeline base line */}
          <div className="absolute top-16 left-6 right-6 bg-dim-gray/20 rounded-full"></div>

          {/* Event bars */}
          <div className="relative h-32 mb-0">
            {timelineEvents.map((event, index) => {
              const verticalOffset = (index % 3) * 20; // Stagger events in 3 rows
              return (
                <div
                  key={event.id}
                  className={`absolute h-7 ${getEventColor(event.type)} rounded-lg flex items-center px-3 text-white text-sm font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  style={{
                    left: `${getEventLeft(event)}%`,
                    width: `${getEventWidth(event)}%`,
                    top: `${0 + verticalOffset}px`,
                    zIndex: 10 + index,
                  }}
                  title={`${event.title} - ${event.subtitle}`}
                  onMouseEnter={(e) => handleEventHover(event, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="truncate text-xs lg:text-sm">
                    {event.title}
                  </span>
                  {event.current && (
                    <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive dots for projects/blogs */}
          <div className="relative">
            {timelineItems.map((item, index) => {
              const leftPosition = getItemLeft(item);
              // Stagger dots vertically if they're close horizontally
              const verticalOffset = index % 2 === 0 ? 0 : 16;

              return (
                <div
                  key={item.id}
                  className="absolute w-6 h-6 bg-white border-3 border-coral rounded-full cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-xl z-30 flex items-center justify-center"
                  style={{
                    left: `${leftPosition}%`,
                    marginLeft: "-12px",
                    top: `${-50 + verticalOffset}px`,
                  }}
                  onMouseEnter={(e) => handleItemHover(item, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="w-2 h-2 bg-coral rounded-full"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center mt-8 p-4 bg-night/30 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-coral rounded-lg shadow-sm"></div>
            <span className="text-sm text-dim-gray font-medium">Education</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-jet rounded-lg shadow-sm"></div>
            <span className="text-sm text-dim-gray font-medium">Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dim-gray rounded-lg shadow-sm"></div>
            <span className="text-sm text-dim-gray font-medium">Research</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-coral rounded-full shadow-sm"></div>
            <span className="text-sm text-dim-gray font-medium">
              Projects & Achievements
            </span>
          </div>
        </div>

        {/* Tooltip */}
        {(hoveredItem || hoveredEvent) && showTooltip && (
          <div
            className={`absolute bg-night border-2 border-coral rounded-xl p-4 text-white text-sm min-w-64 max-w-80 z-40 pointer-events-none shadow-2xl backdrop-blur-sm transition-all duration-200 ${
              showTooltip ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {(() => {
              if (hoveredItem) {
                const item = timelineItems.find((i) => i.id === hoveredItem);
                return item ? (
                  <div>
                    <h4 className="font-bold text-coral text-base mb-1">
                      {item.title}
                    </h4>
                    <p className="text-dim-gray text-xs mb-2 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-white text-xs font-medium">
                      Click to view details →
                    </p>
                  </div>
                ) : null;
              }

              if (hoveredEvent) {
                const event = timelineEvents.find((e) => e.id === hoveredEvent);
                return event ? (
                  <div>
                    <h4 className="font-bold text-coral text-base mb-1">
                      {event.title}
                    </h4>
                    <p className="text-white text-sm mb-1">{event.subtitle}</p>
                    <p className="text-dim-gray text-xs mb-2 leading-relaxed">
                      {event.description}
                    </p>
                    <p className="text-white text-xs font-medium">
                      {event.startYear} - {event.endYear || "Present"}
                    </p>
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
