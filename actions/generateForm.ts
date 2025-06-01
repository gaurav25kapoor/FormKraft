"use server";
import { z } from "zod";

import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const generateForm = async (prevState: unknown, formData: FormData) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const schema = z.object({
      description: z.string().min(1, "Description is required"),
    });

    const result = schema.safeParse({
      description: formData.get("description") as string,
    });

    if (!result.success) {
      return {
        success: false,
        message: "Invalid form data",
        error: result.error.errors,
      };
    }

    const description = result.data.description;

    if (!process.env.OPENAI_API_KEY) {
      return { success: false, message: "OPENAI api key not found" };
    }

    const prompt = `
Create a JSON form with the following structure:
- "title": string, the form title.
- "fields": an array of field objects, each with:
   - "name": string, unique identifier for the field.
   - "label": string, the text label to display.
   - "type": string, one of ["text", "email", "textarea", "dropdown", "radio", "checkbox", "file", "number", "date", "tel"].
   - "placeholder": string, optional placeholder text.
   - "required": boolean, whether the field is mandatory.
   - "options": array of strings, only for "dropdown", "radio", or "checkbox" types.
- "button": object with:
   - "label": string, the button text.
   - "action": string, either "submit" or "publish".

Example:
{
  "title": "Job Application Form",
  "fields": [
    {
      "name": "firstName",
      "label": "First Name",
      "type": "text",
      "placeholder": "Enter your first name",
      "required": true
    },
    {
      "name": "educationLevel",
      "label": "Education Level",
      "type": "dropdown",
      "options": ["High School", "Undergraduate", "Graduate", "Doctorate"],
      "required": false
    }
  ],
  "button": {
    "label": "Submit",
    "action": "submit"
  }
}
Please generate the JSON only, without any extra explanation or text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `${description}\n${prompt}`,
        },
      ],
    });

    const formContent = completion.choices[0]?.message.content;

    if (!formContent) {
      return { success: false, message: "Failed to generate form content" };
    }

    let formJsonData;
    try {
      formJsonData = JSON.parse(formContent);
    } catch (error) {
      console.log("Error parsing JSON", error);
      return {
        success: false,
        message: "Generated form content is not valid JSON",
      };
    }

    const form = await prisma.form.create({
      data: {
        ownerId: user.id,
        content: formJsonData,
      },
    });

    revalidatePath("/dashboard/forms");

    return {
      success: true,
      message: "Form generated successfully",
      data: form,
    };
  } catch (error) {
    console.log("Error generating form", error);
    return {
      success: false,
      message: "An error occurred while generating the form",
    };
  }
};
