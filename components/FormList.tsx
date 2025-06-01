"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { Form } from "@/types/form";
import { deleteForm } from "@/actions/deleteForm";
import toast from "react-hot-toast";

type Props = {
  form: Form;
};

const FormList: React.FC<Props> = ({ form }) => {
  const deleteFormHandler = async (formId: number) => {
    const data = await deleteForm(formId);

    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };
  return (
    <div className="transition duration-300 hover:scale-[1.02]">
      <Card className="w-[350px] shadow-md hover:shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            {form.content.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Deploy your new project in one click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/dashboard/forms/${form.id}/submissions`}>
            <Button
              variant="link"
              className="text-blue-600 dark:text-blue-400 hover:underline transition duration-200 p-0"
            >
              Submissions – {form.submissions}
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/dashboard/forms/edit/${form.id}`} passHref>
            <Button
              variant="outline"
              className="gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Edit2 size={16} />
              Edit
            </Button>
          </Link>
          <Button
            onClick={() => deleteFormHandler(form.id)}
            variant="destructive"
            className="hover:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormList;
