import { BusinessCardSkeleton, Bone, HeaderSkeleton, Loading } from "@/components/skeletons";
import { container } from "@/components/ui";

export default function BusinessesLoading() {
  return (
    <>
      <HeaderSkeleton />
      <Loading label="Loading businesses" />
      <div className="border-b border-line bg-brand-wash">
        <div className={`${container} py-8 lg:py-10`}>
          <Bone className="h-4 w-40 bg-line" />
          <Bone className="mt-4 h-10 w-72 max-w-full bg-line" />
          <Bone className="mt-6 h-16 w-full max-w-3xl rounded-2xl bg-line" />
        </div>
      </div>
      <main className={`${container} flex-1 py-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:py-10`}>
        <div className="flex gap-2 overflow-hidden lg:flex-col">
          {Array.from({ length: 6 }, (_, i) => (
            <Bone key={i} className="h-11 w-24 shrink-0 rounded-xl lg:w-full" />
          ))}
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-0 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i}>
              <BusinessCardSkeleton />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
