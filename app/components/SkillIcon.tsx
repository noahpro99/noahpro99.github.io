import React from "react";
import { Database, Table, Box, Code2 } from "lucide-react";
import {
  siPython,
  siTypescript,
  siReact,
  siRust,
  siLinux,
  siDocker,
  siGit,
  siTensorflow,
  siPytorch,
  siPandas,
  siBlender,
  siGodotengine,
  siGoogleappsscript,
  siHuggingface,
  siRaylib,
} from "simple-icons";

interface SimpleIconProps {
  iconData: {
    path: string;
    hex: string;
  };
  className?: string;
}

function SimpleIcon({ iconData, className }: SimpleIconProps) {
  return (
    <svg
      className={className}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d={iconData.path} />
    </svg>
  );
}

interface SkillIconProps {
  type: string;
  className?: string;
}

export function SkillIcon({ type, className = "w-4 h-4" }: SkillIconProps) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    python: () => <SimpleIcon iconData={siPython} className={className} />,
    typescript: () => (
      <SimpleIcon iconData={siTypescript} className={className} />
    ),
    react: () => <SimpleIcon iconData={siReact} className={className} />,
    rust: () => <SimpleIcon iconData={siRust} className={className} />,
    linux: () => <SimpleIcon iconData={siLinux} className={className} />,
    docker: () => <SimpleIcon iconData={siDocker} className={className} />,
    git: () => <SimpleIcon iconData={siGit} className={className} />,
    tensorflow: () => (
      <SimpleIcon iconData={siTensorflow} className={className} />
    ),
    pytorch: () => <SimpleIcon iconData={siPytorch} className={className} />,
    pandas: () => <SimpleIcon iconData={siPandas} className={className} />,
    blender: () => <SimpleIcon iconData={siBlender} className={className} />,
    godotengine: () => (
      <SimpleIcon iconData={siGodotengine} className={className} />
    ),
    googleappsscript: () => (
      <SimpleIcon iconData={siGoogleappsscript} className={className} />
    ),
    huggingface: () => (
      <SimpleIcon iconData={siHuggingface} className={className} />
    ),
    c: () => <Code2 className={className} />,
    database: () => <Database className={className} />,
    spreadsheet: () => <Table className={className} />,
    table: () => <Table className={className} />,
    cube: () => <Box className={className} />,
    rllib: () => <SimpleIcon iconData={siRaylib} className={className} />,
  };

  const IconComponent =
    iconMap[type] || (() => <Code2 className={className} />);

  return <IconComponent />;
}
