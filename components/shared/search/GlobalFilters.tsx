"use client";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 paragraph-semibold">Type</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              handleTypeClick(type.value);
            }}
            className={`light-border-2 small-medium rounded-xl  px-5 py-2 capitalize    
            ${
              active === type.value
                ? "!hover:text-lime-100 bg-primary-500 text-light-900"
                : "hover:text-primary-500 dark:bg-dark-500/50 "
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
