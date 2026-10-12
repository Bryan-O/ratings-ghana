import { Bone, HeaderSkeleton, Loading } from "@/components/skeletons";
import { container } from "@/components/ui";

export default function BusinessLoading() {
  return (
    <>
      <HeaderSkeleton />
      <Loading label="Loading business" />
      <main id="main" tabIndex={-1} className="flex-1 bg-ink">
        <div className={`${container} pt-1 pb-5`}>
          <span aria-hidden className="block h-4 w-48 animate-pulse rounded-lg bg-white/10" />
        </div>
        <div className="rounded-t-3xl bg-paper sm:rounded-t-[2.5rem]">
          <div className={`${container} grid gap-x-12 gap-y-8 pt-8 pb-16 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_22.5rem]`}>
            <div className="flex flex-col gap-5 sm:flex-row">
              <Bone className="size-24 shrink-0 rounded-xl sm:size-32" />
              <div className="flex-1">
                <Bone className="h-5 w-40" />
                <Bone className="mt-3 h-10 w-72 max-w-full" />
                <Bone className="mt-3 h-5 w-56 max-w-full" />
                <Bone className="mt-4 h-11 w-48 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:row-span-2">
              <Bone className="h-52 rounded-2xl" />
              <Bone className="h-20 rounded-2xl" />
              <Bone className="h-20 rounded-2xl" />
            </div>
            <div className="flex flex-col gap-6">
              <Bone className="h-64 rounded-2xl" />
              <Bone className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
