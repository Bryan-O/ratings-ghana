import { Bone, HeaderSkeleton, Loading } from "@/components/skeletons";
import { container } from "@/components/ui";

export default function BusinessLoading() {
  return (
    <>
      <HeaderSkeleton />
      <Loading label="Loading business" />
      <div className="border-b border-line">
        <div className={`${container} py-8`}>
          <Bone className="h-4 w-48" />
          <Bone className="mt-5 h-7 w-40" />
          <Bone className="mt-3 h-12 w-80 max-w-full" />
          <Bone className="mt-3 h-6 w-64 max-w-full" />
        </div>
      </div>
      <main className={`${container} flex-1 py-8`}>
        <Bone className="h-44 rounded-3xl sm:h-64" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          <div className="flex flex-col gap-6">
            <Bone className="h-32 rounded-2xl" />
            <Bone className="h-48 rounded-2xl" />
            <Bone className="h-40 rounded-2xl" />
          </div>
          <Bone className="h-72 rounded-2xl" />
        </div>
      </main>
    </>
  );
}
