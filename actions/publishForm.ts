"use server"
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const publishForm = async (formId: number) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    if (!formId) {
      return { sucess: false, message: "Form id not found" };
    }

    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) {
      return { success: false, message: "Form not found" };
    }
    if (form.ownerId !== user.id) {
      return { success: false, message: "Unauthorized" };
    }
    await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        published: true,
      },
    });
  } catch (error) {
    console.log("Error publishing form");
    return {success:false,message:"Error while publishing the form"}
  }
};
