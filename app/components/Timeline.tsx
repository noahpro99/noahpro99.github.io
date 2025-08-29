import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import {
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
  const timelineItems = useMemo(() => getTimelineContent(), []);
  const defaultActive = timelineItems.length
    ? timelineItems[timelineItems.length - 1].id
    : null;
  const [activeItem, setActiveItem] = useState<string | null>(defaultActive);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [connectorHeight, setConnectorHeight] = useState<number | null>(null);

  // Get timeline items from content
  const activeTimelineItem = activeItem
    ? timelineItems.find((i) => i.id === activeItem)
    : null;
  const activeTimelineEvent = activeEvent
    ? timelineEvents.find((e) => e.id === activeEvent)
    : null;

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

  const updateConnectorFromEl = (el?: HTMLElement | null) => {
    if (!el || !detailsRef.current) return;
    const elRect = el.getBoundingClientRect();
    const detailsRect = detailsRef.current.getBoundingClientRect();
    const targetY = elRect.top + elRect.height / 2;
    // Stop slightly before the element so the diamond meets it visually
    const height = Math.max(8, targetY - detailsRect.top - 8);
    setConnectorHeight(height);
  };

  const activateItem = (item: ContentItem, el?: HTMLElement | null) => {
    setActiveItem(item.id);
    setActiveEvent(null);
    if (el) updateConnectorFromEl(el);
  };

  const activateEvent = (event: TimelineEvent, el?: HTMLElement | null) => {
    setActiveEvent(event.id);
    setActiveItem(null);
    if (el) updateConnectorFromEl(el);
  };

  const handleItemHover = (item: ContentItem, el?: HTMLElement | null) => {
    if (window.matchMedia("(hover: hover)").matches) {
      activateItem(item, el);
    }
  };

  const handleEventHover = (event: TimelineEvent, el?: HTMLElement | null) => {
    if (window.matchMedia("(hover: hover)").matches) {
      activateEvent(event, el);
    }
  };

  const handleItemClick = (item: ContentItem, el?: HTMLElement | null) => {
    activateItem(item, el);
  };

  const handleEventClick = (event: TimelineEvent, el?: HTMLElement | null) => {
    activateEvent(event, el);
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

  // Layout: assign non-overlapping lanes to event bars based on their time span
  const { eventLane, laneCount } = useMemo(() => {
    type Box = { id: string; start: number; end: number };
    const boxes: Box[] = timelineEvents
      .map((e) => {
        const left = getEventLeft(e);
        const width = getEventWidth(e);
        return { id: e.id, start: left, end: Math.min(100, left + width) };
      })
      .sort((a, b) => a.start - b.start);

    const lanes: number[] = []; // last "end" percent per lane
    const map: Record<string, number> = {};
    const minGap = 0.5; // percentage spacing to avoid visual touching
    for (const b of boxes) {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        if (b.start >= lanes[i] + minGap) {
          map[b.id] = i;
          lanes[i] = b.end;
          placed = true;
          break;
        }
      }
      if (!placed) {
        map[b.id] = lanes.length;
        lanes.push(b.end);
      }
    }
    return { eventLane: map, laneCount: Math.max(1, lanes.length) };
  }, []);

  // When active changes without a mouse event (e.g., default selection or resize),
  // try to locate the active element and update connector height.
  useEffect(() => {
    const id = activeItem
      ? `item-${activeItem}`
      : activeEvent
        ? `event-${activeEvent}`
        : null;
    if (!id) return;
    const el = document.querySelector<HTMLElement>(
      `[data-timeline-id="${id}"]`
    );
    if (el) updateConnectorFromEl(el);
  }, [activeItem, activeEvent]);

  useEffect(() => {
    const onResize = () => {
      const id = activeItem
        ? `item-${activeItem}`
        : activeEvent
          ? `event-${activeEvent}`
          : null;
      if (!id) return;
      const el = document.querySelector<HTMLElement>(
        `[data-timeline-id="${id}"]`
      );
      if (el) updateConnectorFromEl(el);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeItem, activeEvent]);

  return (
    <div
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

        {/* Timeline container - horizontal scroll only; prevent vertical scrollbars */}
        <div className="overflow-x-auto overflow-y-hidden sm:overflow-x-visible scrollbar-thin scrollbar-thumb-coral scrollbar-track-night/50">
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
            <div className="relative bg-night/50 rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 md:p-6 overflow-visible">
              {/* Timeline base line */}
              <div className="absolute top-8 sm:top-10 md:top-12 lg:top-16 left-2 sm:left-3 md:left-6 right-2 sm:right-3 md:right-6 bg-dim-gray/20 rounded-full h-0.5"></div>

              {/* Event bars */}
              <div
                className="relative mb-0"
                style={{ height: `${Math.max(64, laneCount * 16)}px` }}
              >
                {timelineEvents.map((event, index) => {
                  const lane = eventLane[event.id] ?? 0;
                  const verticalOffset = lane * 12; // 12px per lane
                  return (
                    <div
                      key={event.id}
                      data-timeline-id={`event-${event.id}`}
                      className={`absolute h-3 sm:h-4 md:h-5 lg:h-7 ${getEventColor(event.type)} rounded-md sm:rounded-lg md:rounded-xl flex items-center px-1 sm:px-2 md:px-3 text-white text-xs font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                      style={{
                        left: `${getEventLeft(event)}%`,
                        width: `${getEventWidth(event)}%`,
                        top: `${0 + verticalOffset}px`,
                        zIndex: 10 + index,
                      }}
                      title={`${event.title} - ${event.subtitle}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${event.title} ${event.subtitle}`}
                      onMouseEnter={(e) =>
                        handleEventHover(event, e.currentTarget)
                      }
                      onClick={(e) => handleEventClick(event, e.currentTarget)}
                      onTouchStart={(e) =>
                        handleEventClick(event, e.currentTarget)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleEventClick(
                            event,
                            e.currentTarget as HTMLElement
                          );
                        }
                      }}
                    >
                      <span className="truncate text-xs">{event.title}</span>
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
                  const verticalOffset = index % 2 === 0 ? 0 : 10;

                  return (
                    <div
                      key={item.id}
                      data-timeline-id={`item-${item.id}`}
                      className="absolute w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-white border border-coral sm:border-2 md:border-3 rounded-full cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-xl z-30 flex items-center justify-center"
                      style={{
                        left: `${leftPosition}%`,
                        marginLeft: "-6px", // Half of mobile width
                        top: `${-20 + verticalOffset}px`,
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.title}`}
                      onMouseEnter={(e) =>
                        handleItemHover(item, e.currentTarget)
                      }
                      onClick={(e) => handleItemClick(item, e.currentTarget)}
                      onTouchStart={(e) =>
                        handleItemClick(item, e.currentTarget)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleItemClick(item, e.currentTarget as HTMLElement);
                        }
                      }}
                    >
                      <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-2 md:h-2 bg-coral rounded-full"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {(activeTimelineItem || activeTimelineEvent) && (
          <div className="relative mt-4 sm:mt-6 md:mt-8" ref={detailsRef}>
            {(() => {
              let leftPercent: number | null = null;
              if (activeTimelineItem) {
                leftPercent = getItemLeft(activeTimelineItem);
              } else if (activeTimelineEvent) {
                leftPercent =
                  getEventLeft(activeTimelineEvent) +
                  getEventWidth(activeTimelineEvent) / 2;
              }
              if (leftPercent === null) return null;

              return (
                <>
                  {/* Vertical connector in the margin gap only (avoids crossing timeline content) */}
                  <div
                    className="absolute z-20 w-px bg-coral/60"
                    style={{
                      left: `calc(${leftPercent}% - 0.5px)`,
                      top: -(connectorHeight ?? 24),
                      height: connectorHeight ?? 24,
                    }}
                  />
                  {/* Pointer diamond touching the panel */}
                  <div
                    className="absolute -top-2 h-2 w-2 bg-coral rotate-45 rounded-[2px]"
                    style={{ left: `calc(${leftPercent}% - 4px)` }}
                  />
                </>
              );
            })()}

            <div className="p-3 sm:p-4 bg-night/30 rounded-xl sm:rounded-2xl md:rounded-3xl text-white transition-all duration-300">
              {activeTimelineItem ? (
                <div>
                  <p className="text-dim-gray text-[10px] uppercase tracking-wide mb-1">
                    From {activeTimelineItem.type}
                  </p>
                  <h4 className="font-bold text-coral text-sm md:text-base mb-1">
                    {activeTimelineItem.title}
                  </h4>
                  <p className="text-dim-gray text-xs leading-relaxed mb-2">
                    {activeTimelineItem.description}
                  </p>
                  {activeTimelineItem.type === "blog" &&
                  activeTimelineItem.blogPath ? (
                    <Link
                      to={`/content/${activeTimelineItem.id}`}
                      className="inline-block mt-1 px-3 py-1 bg-coral rounded text-white text-xs font-medium hover:bg-coral/80"
                    >
                      Read more →
                    </Link>
                  ) : activeTimelineItem.githubRepo ? (
                    <a
                      href={`https://github.com/${activeTimelineItem.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 px-3 py-1 bg-coral rounded text-white text-xs font-medium hover:bg-coral/80"
                    >
                      View on GitHub →
                    </a>
                  ) : activeTimelineItem.link ? (
                    <a
                      href={activeTimelineItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 px-3 py-1 bg-coral rounded text-white text-xs font-medium hover:bg-coral/80"
                    >
                      Visit project →
                    </a>
                  ) : null}
                </div>
              ) : activeTimelineEvent ? (
                <div>
                  <p className="text-dim-gray text-[10px] uppercase tracking-wide mb-1">
                    From event
                  </p>
                  <h4 className="font-bold text-coral text-sm md:text-base mb-1">
                    {activeTimelineEvent.title}
                  </h4>
                  <p className="text-white text-xs mb-1">
                    {activeTimelineEvent.subtitle}
                  </p>
                  <p className="text-dim-gray text-xs leading-relaxed mb-2">
                    {activeTimelineEvent.description}
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
                      const startMonth =
                        monthNames[activeTimelineEvent.startMonth];
                      const endDisplay =
                        activeTimelineEvent.endYear &&
                        activeTimelineEvent.endMonth !== undefined
                          ? `${monthNames[activeTimelineEvent.endMonth]} ${activeTimelineEvent.endYear}`
                          : "Present";
                      return `${startMonth} ${activeTimelineEvent.startYear} - ${endDisplay}`;
                    })()}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
