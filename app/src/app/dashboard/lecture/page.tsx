import LectureTheatre from "@/components/LectureTheatre";

export default function LecturePage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  return <LectureTheatre searchParamsPromise={searchParams} />;
}
