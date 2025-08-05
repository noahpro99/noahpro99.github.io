import { useState, useRef } from "react";
import {
  getContentById,
  timelineEvents,
  timelineItems,
  type TimelineEvent,
  type TimelineItem,
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
  const timelineRef = useRef<HTMLDivElement>(null);

  const startYear = 2021;
  const endYear = 2025;
  const totalYears = endYear - startYear;

  const getEventWidth = (event: TimelineEvent) => {
    const eventEndYear = event.endYear || endYear;
    const duration = eventEndYear - event.startYear;
    return Math.max((duration / totalYears) * 100, 8); // Minimum 8% width
  };

  const getEventLeft = (event: TimelineEvent) => {
    return ((event.startYear - startYear) / totalYears) * 100;
  };

  const getItemLeft = (item: TimelineItem) => {
    return ((item.year - startYear) / totalYears) * 100;
  };

  const handleItemHover = (item: TimelineItem, event: React.MouseEvent) => {
    setHoveredItem(item.id);
    const rect = event.currentTarget.getBoundingClientRect();
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (timelineRect) {
      setTooltipPosition({
        x: rect.left - timelineRect.left + rect.width / 2,
        y: rect.top - timelineRect.top - 10,
      });
    }
  };

  const handleEventHover = (
    event: TimelineEvent,
    mouseEvent: React.MouseEvent
  ) => {
    setHoveredEvent(event.id);
    const rect = mouseEvent.currentTarget.getBoundingClientRect();
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (timelineRect) {
      setTooltipPosition({
        x: rect.left - timelineRect.left + rect.width / 2,
        y: rect.top - timelineRect.top - 10,
      });
    }
  };

  const handleItemClick = (item: TimelineItem) => {
    if (item.contentId) {
      const content = getContentById(item.contentId);
      if (content?.type === "blog" && content.blogPath) {
        window.location.href = `/content/${content.id}`;
      } else if (content?.type === "project" && content.link) {
        window.open(content.link, "_blank");
      } else if (content?.githubRepo) {
        window.open(`https://github.com/${content.githubRepo}`, "_blank");
      }
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    // If event has content, navigate to the first content item
    if (event.contentIds && event.contentIds.length > 0) {
      const content = getContentById(event.contentIds[0]);
      if (content?.type === "blog" && content.blogPath) {
        window.location.href = `/content/${content.id}`;
      } else if (content?.type === "project" && content.link) {
        window.open(content.link, "_blank");
      } else if (content?.githubRepo) {
        window.open(`https://github.com/${content.githubRepo}`, "_blank");
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
        <div className="relative bg-night/50 rounded-2xl p-6 mb-8">
          {/* Timeline base line */}
          <div className="absolute top-8 left-6 right-6 h-2 bg-dim-gray/20 rounded-full"></div>

          {/* Event bars */}
          <div className="relative h-20 mb-4">
            {timelineEvents.map((event, index) => (
              <div
                key={event.id}
                className={`absolute h-8 ${getEventColor(event.type)} rounded-lg flex items-center px-4 text-white text-sm font-medium cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                style={{
                  left: `${getEventLeft(event)}%`,
                  width: `${getEventWidth(event)}%`,
                  top: `${8 + index * 18}px`,
                  zIndex: 10 + index,
                }}
                title={`${event.title} - ${event.subtitle}`}
                onMouseEnter={(e) => handleEventHover(event, e)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => handleEventClick(event)}
              >
                <span className="truncate text-xs lg:text-sm">
                  {event.title}
                </span>
                {event.current && (
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive dots for projects/blogs */}
          <div className="relative">
            {timelineItems.map((item) => (
              <div
                key={item.id}
                className="absolute top-1 w-6 h-6 bg-white border-3 border-coral rounded-full cursor-pointer hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-xl z-30 flex items-center justify-center"
                style={{ left: `${getItemLeft(item)}%`, marginLeft: "-12px" }}
                onMouseEnter={(e) => handleItemHover(item, e)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item)}
              >
                <div className="w-2 h-2 bg-coral rounded-full"></div>
              </div>
            ))}
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
        {(hoveredItem || hoveredEvent) && (
          <div
            className="absolute bg-night border-2 border-coral rounded-xl p-4 text-white text-sm max-w-xs z-40 pointer-events-none shadow-2xl backdrop-blur-sm"
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
                    {event.contentIds && event.contentIds.length > 0 && (
                      <p className="text-coral text-xs font-medium mt-1">
                        Click to view related content →
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
