import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Eye } from "lucide-react";
import { Form } from "@/types/form";

type Props = {
  noOfSubmissions: number;
  form:Form
};

const Analytics: React.FC<Props> = ({form }) => {
  return (
    <div className="transition duration-300 hover:scale-[1.02]">
      <Card className="w-[350px] shadow-md hover:shadow-xl rounded-2xl border border-yellow-400 dark:border-yellow-500 bg-white dark:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-bold text-gray-800 dark:text-yellow-400">
            {form.content.title}
          </CardTitle>
          <Eye className="text-gray-600 dark:text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-gray-800 dark:text-white mb-1">
            {form.submissions}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total submissions to your forms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
