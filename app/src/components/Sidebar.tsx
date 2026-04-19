"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Subtopic {
  id: string;
  label: string;
}

interface Domain {
  id: string;
  label: string;
  subtopics: Subtopic[];
}

interface CoreGroup {
  id: string;
  label: string;
  domains: Domain[];
}

const CORES: CoreGroup[] = [
  {
    id: "core1",
    label: "Core 1 (220-1101)",
    domains: [
      {
        id: "1.0",
        label: "1.0 Mobile Devices",
        subtopics: [
          { id: "1.1", label: "1.1 Laptop Hardware & Components" },
          { id: "1.2", label: "1.2 Laptop Displays" },
          { id: "1.3", label: "1.3 Laptop Features" },
          { id: "1.4", label: "1.4 Mobile Device Types" },
          { id: "1.5", label: "1.5 Mobile Device Connectivity" },
          { id: "1.6", label: "1.6 Mobile Device Synchronization" },
        ],
      },
      {
        id: "2.0",
        label: "2.0 Networking",
        subtopics: [
          { id: "2.1", label: "2.1 Network Devices" },
          { id: "2.2", label: "2.2 Routing & Switching" },
          { id: "2.3", label: "2.3 Wireless Networking" },
          { id: "2.4", label: "2.4 Network Services & Protocols" },
          { id: "2.5", label: "2.5 Internet Connection Types" },
          { id: "2.6", label: "2.6 Network Hosts" },
          { id: "2.7", label: "2.7 IoT Devices" },
          { id: "2.8", label: "2.8 Network Tools & Commands" },
        ],
      },
      {
        id: "3.0",
        label: "3.0 Hardware",
        subtopics: [
          { id: "3.1", label: "3.1 Cable Types & Connectors" },
          { id: "3.2", label: "3.2 RAM Types & Features" },
          { id: "3.3", label: "3.3 Storage Devices" },
          { id: "3.4", label: "3.4 Motherboards, CPUs & Expansion Cards" },
          { id: "3.5", label: "3.5 Power Supplies" },
          { id: "3.6", label: "3.6 Multifunction Printers" },
          { id: "3.7", label: "3.7 Display Technologies" },
        ],
      },
      {
        id: "4.0",
        label: "4.0 Virtualization & Cloud",
        subtopics: [
          { id: "4.1", label: "4.1 Cloud Computing Concepts" },
          { id: "4.2", label: "4.2 Client-Side Virtualization" },
        ],
      },
      {
        id: "5.0",
        label: "5.0 Hardware & Network Troubleshooting",
        subtopics: [
          { id: "5.1", label: "5.1 Troubleshooting Methodology" },
          { id: "5.2", label: "5.2 Troubleshooting Cables & Networks" },
          { id: "5.3", label: "5.3 Troubleshooting Storage Drives" },
          { id: "5.4", label: "5.4 Troubleshooting Video & Projectors" },
          { id: "5.5", label: "5.5 Troubleshooting Mobile Devices" },
          { id: "5.6", label: "5.6 Troubleshooting Printers" },
          { id: "5.7", label: "5.7 Troubleshooting Networks" },
        ],
      },
    ],
  },
  {
    id: "core2",
    label: "Core 2 (220-1102)",
    domains: [
      {
        id: "c2-1.0",
        label: "1.0 Operating Systems",
        subtopics: [
          { id: "c2-1.1", label: "1.1 Windows Editions & Versions" },
          { id: "c2-1.2", label: "1.2 Windows Settings & Control Panel" },
          { id: "c2-1.3", label: "1.3 Windows Administrative Tools" },
          { id: "c2-1.4", label: "1.4 Windows Command Line & PowerShell" },
          { id: "c2-1.5", label: "1.5 Windows OS Installation & Upgrades" },
          { id: "c2-1.6", label: "1.6 Windows Networking Features" },
          { id: "c2-1.7", label: "1.7 Windows Security Settings" },
          { id: "c2-1.8", label: "1.8 Windows Remote Access" },
          { id: "c2-1.9", label: "1.9 macOS Features & Tools" },
          { id: "c2-1.10", label: "1.10 Linux Features & Commands" },
        ],
      },
      {
        id: "c2-2.0",
        label: "2.0 Security",
        subtopics: [
          { id: "c2-2.1", label: "2.1 Security Threats & Vulnerabilities" },
          { id: "c2-2.2", label: "2.2 Malware Types & Removal" },
          { id: "c2-2.3", label: "2.3 Social Engineering Attacks" },
          { id: "c2-2.4", label: "2.4 Wireless Security Protocols" },
          { id: "c2-2.5", label: "2.5 Logical Security Controls" },
          { id: "c2-2.6", label: "2.6 Physical Security Measures" },
          { id: "c2-2.7", label: "2.7 Data Destruction & Disposal" },
          { id: "c2-2.8", label: "2.8 Browser Security" },
        ],
      },
      {
        id: "c2-3.0",
        label: "3.0 Software Troubleshooting",
        subtopics: [
          { id: "c2-3.1", label: "3.1 Troubleshoot Windows OS Issues" },
          { id: "c2-3.2", label: "3.2 Troubleshoot PC Security Issues" },
          { id: "c2-3.3", label: "3.3 Troubleshoot Mobile Device Software" },
          { id: "c2-3.4", label: "3.4 Troubleshoot Browser & Application Issues" },
        ],
      },
      {
        id: "c2-4.0",
        label: "4.0 Operational Procedures",
        subtopics: [
          { id: "c2-4.1", label: "4.1 Documentation & Change Management" },
          { id: "c2-4.2", label: "4.2 Disaster Recovery & Backup" },
          { id: "c2-4.3", label: "4.3 Scripting Basics" },
          { id: "c2-4.4", label: "4.4 Remote Access Technologies" },
          { id: "c2-4.5", label: "4.5 Safety Procedures & Compliance" },
          { id: "c2-4.6", label: "4.6 Environmental Impacts & Controls" },
          { id: "c2-4.7", label: "4.7 Privacy, Licensing & Policies" },
          { id: "c2-4.8", label: "4.8 Communication & Professionalism" },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get("topic") ?? "";

  const [openCores, setOpenCores] = useState<Record<string, boolean>>({ core1: true });
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({});

  function toggleCore(id: string) {
    setOpenCores((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleDomain(id: string) {
    setOpenDomains((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function navigate(label: string) {
    router.push(`/dashboard/lecture?topic=${encodeURIComponent(label)}`);
  }

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto shrink-0">
      <div className="p-4 space-y-1">
        {CORES.map((core) => (
          <div key={core.id}>
            <button
              onClick={() => toggleCore(core.id)}
              className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-zinc-200 hover:bg-zinc-800 text-sm font-bold transition-colors"
            >
              <span>{core.label}</span>
              {openCores[core.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {openCores[core.id] && (
              <div className="mt-1 space-y-0.5 pl-2">
                {core.domains.map((domain) => (
                  <div key={domain.id}>
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className="w-full flex items-center justify-between text-left px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 text-xs font-semibold transition-colors"
                    >
                      <span>{domain.label}</span>
                      {openDomains[domain.id] ? (
                        <ChevronDown size={12} />
                      ) : (
                        <ChevronRight size={12} />
                      )}
                    </button>

                    {openDomains[domain.id] && (
                      <div className="mt-0.5 space-y-0.5 pl-3">
                        {domain.subtopics.map((sub) => {
                          const isActive = activeTopic === sub.label;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => navigate(sub.label)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                isActive
                                  ? "bg-blue-900/40 text-blue-300"
                                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                              }`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
