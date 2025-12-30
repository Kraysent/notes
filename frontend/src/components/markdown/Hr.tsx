import type { ReactNode } from "react";

export interface HrProps {
  children?: ReactNode;
}

export function Hr(props: HrProps) {
  return (
    <hr className="mt-6 mb-6 border-0 border-t border-t-white/20" {...props} />
  );
}
