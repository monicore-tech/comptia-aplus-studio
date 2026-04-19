import LectureTheatre from "@/components/LectureTheatre";

export default function LecturePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  return <LectureTheatre searchParamsPromise={searchParams} />;
}
