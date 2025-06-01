import { getFormStats } from "@/actions/formStats";
import { getForms } from "@/actions/getForms";
import Analytics from "@/components/Analytics";
import React from "react";

const Page = async () => {
  const data = await getFormStats();
  const formsResponse = await getForms(); 

  return (
    <div className="grid grid-cols-3 gap-10">
      {formsResponse.data?.map((form: any, index: number) => (
        <Analytics key={index} form={form} noOfSubmissions={data || 0} />
      ))}
    </div>
  );
};

export default Page;
