"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { publishForm } from "@/actions/publishForm";
import FormPublishDialog from "./FormPublishDialog";
import toast from "react-hot-toast";
import { submitForm } from "@/actions/submitForm";

const AiGeneratedForm: React.FC<{ form: any; isEditMode: boolean }> = ({
  form,
  isEditMode,
}) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      await publishForm(form.id);
      setSuccessDialogOpen(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: string,
    option: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const current = prev[name] ?? [];
      if (checked) {
        if (!current.includes(option)) {
          return { ...prev, [name]: [...current, option] };
        }
      } else {
        return { ...prev, [name]: current.filter((v: string) => v !== option) };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await submitForm(form.id, formData);
    if (data?.success) {
      toast.success(data.message);
      setFormData({});
    } else {
      toast.error(data?.message || "Something went wrong");
    }
  };

  // Safe parsing
  let value;
  try {
    value =
      typeof form.content !== "object"
        ? JSON.parse(form.content)
        : form.content;
  } catch (err) {
    console.error("Invalid JSON format for form.content", err);
    return <p className="text-red-500">Failed to load form content.</p>;
  }

  const fields = Array.isArray(value?.fields) ? value.fields : [];

  if (fields.length === 0) {
    return <p className="text-center text-gray-500">No fields found in the form.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md">
      <form
        onSubmit={isEditMode ? handlePublish : handleSubmit}
        className="space-y-6"
      >
        {fields.map((item: any, index: number) => {
          const commonProps = {
            name: item.name ?? item.label,
            required: !isEditMode && item.required,
          };

          if (
            ["text", "email", "date", "tel", "number", "file"].includes(item.type)
          ) {
            return (
              <div key={index} className="mb-4">
                <Label className="block mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
                  {item.label}
                </Label>
                <Input
                  {...commonProps}
                  type={item.type}
                  placeholder={item.placeholder}
                  value={formData[commonProps.name] || ""}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            );
          }

          if (item.type === "textarea") {
            return (
              <div key={index} className="mb-4">
                <Label className="block mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
                  {item.label}
                </Label>
                <Textarea
                  {...commonProps}
                  placeholder={item.placeholder}
                  value={formData[commonProps.name] || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded min-h-[100px]"
                />
              </div>
            );
          }

          if (item.type === "dropdown") {
            return (
              <div key={index} className="mb-4">
                <Label className="block mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
                  {item.label}
                </Label>
                <Select
                  onValueChange={(val) => handleSelectChange(commonProps.name, val)}
                  value={formData[commonProps.name] || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={item.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {item.options?.map((option: string, i: number) => (
                      <SelectItem key={i} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          if (item.type === "radio") {
            return (
              <div key={index} className="mb-4">
                <Label className="block mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
                  {item.label}
                </Label>
                <RadioGroup
                  value={formData[commonProps.name] || ""}
                  onValueChange={(val) =>
                    handleRadioChange(commonProps.name, val)
                  }
                  className="space-y-2 mt-2"
                >
                  {item.options?.map((option: string, i: number) => (
                    <Label
                      key={i}
                      htmlFor={`radio-${commonProps.name}-${i}`}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        id={`radio-${commonProps.name}-${i}`}
                        value={option}
                        required={!isEditMode && item.required}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {option}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            );
          }

          if (item.type === "checkbox") {
            return (
              <div key={index} className="mb-4">
                <Label className="block mb-2 text-base font-semibold text-gray-700 dark:text-gray-200">
                  {item.label}
                </Label>
                <div className="space-y-2 mt-2">
                  {(item.options ?? ["Yes"]).map((option: string, i: number) => {
                    const checked =
                      formData[commonProps.name]?.includes(option) || false;
                    return (
                      <Label
                        key={i}
                        className="flex items-center space-x-2"
                        htmlFor={`checkbox-${commonProps.name}-${i}`}
                      >
                        <Checkbox
                          id={`checkbox-${commonProps.name}-${i}`}
                          checked={checked}
                          onCheckedChange={(checkedValue: boolean) =>
                            handleCheckboxChange(
                              commonProps.name,
                              option,
                              checkedValue
                            )
                          }
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {option}
                        </span>
                      </Label>
                    );
                  })}
                </div>
              </div>
            );
          }

          return null;
        })}

        <Button
          type="submit"
          className="w-full py-3 text-lg font-semibold tracking-wide rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition duration-200 ease-in-out"
        >
          {isEditMode
            ? "Publish"
            : form.content.button?.label ||
              form.content.button?.text ||
              "Submit"}
        </Button>
      </form>

      <FormPublishDialog
        formId={form.id}
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
      />
    </div>
  );
};

export default AiGeneratedForm;
