"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

const DOMAINS = [
  {
    id: "core1",
    label: "Core 1 (220-1101)",
    domains: [
      { id: "1.0", label: "1.0 Mobile Devices" },
      { id: "2.0", label: "2.0 Networking" },
      { id: "3.0", label: "3.0 Hardware" },
      { id: "4.0", label: "4.0 Virtualization & Cloud" },
      { id: "5.0", label: "5.0 Hardware & Network Troubleshooting" },
    ],
  },
  {
    id: "core2",
    label: "Core 2 (220-1102)",
    domains: [
      { id: "6.0", label: "1.0 Operating Systems" },
      { id: "7.0", label: "2.0 Security" },
      { id: "8.0", label: "3.0 Software Troubleshooting" },
      { id: "9.0", label: "4.0 Operational Procedures" },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({ core1: true });

  function navigate(domainId: string) {
    router.push(`/dashboard/lecture?domain=${encodeURIComponent(domainId)}`);
  }

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto shrink-0">
      <div className="p-4 space-y-1">
        {DOMAINS.map((group) => (
          <div key={group.id}>
            <button
              onClick={() =>
                setOpen((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
              }
              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 text-sm font-semibold transition-colors"
            >
              <span>{group.label}</span>
              {open[group.id] ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>

            {open[group.id] && (
              <div className="mt-1 space-y-0.5 pl-2">
                {group.domains.map((d) => {
                  const isActive = pathname.includes(
                    `domain=${encodeURIComponent(d.id)}`
                  );
                  return (
                    <button
                      key={d.id}
                      onClick={() => navigate(d.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-blue-900/40 text-blue-300"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
