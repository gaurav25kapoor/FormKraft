
"use client"
import React, { ChangeEvent, useActionState, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { Sparkles } from "lucide-react";
import { generateForm } from "@/actions/generateForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type InitialState={
  message:string;
  success:boolean;
  data?:any
}
const initialState :InitialState={
  message:"",
  success:false
}
const GenerateFormInput :React.FC<{text?:string}> = ({text}) => {
  const [description,setDescription]=useState<string | undefined>(text)
  const [state,formAction]=useActionState(generateForm,initialState)
  const router=useRouter()
  const changeEventHandler=(e:ChangeEvent<HTMLInputElement>)=>{
    setDescription(e.target.value)
  }

  useEffect(()=>{
    if(state.success){
      toast(state.message)
      router.push(`/dashboard/forms/edit/${state.data.id}`)
    }else if(state.message){
      toast.error(state.message)
    }
  },[router,state])

  useEffect(()=>{
    setDescription(text)
  },[text])
  return (
    <form action={formAction} className="flex items-center gap-4 my-8">
      <Input id="description" name="description" value={description} onChange={changeEventHandler} type="text" placeholder="Write a prompt to generate form..." required />
      <SubmitButton/>
    </form>
  );
};

export default GenerateFormInput;

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    
    <Button disabled={pending} className="
    h-12 
    bg-gradient-to-r from-blue-500 to-purple-600 
    cursor-pointer 
    transition 
    duration-300 
    ease-in-out 
    hover:from-purple-600 
    hover:to-white
  ">
      <Sparkles className="mr-2"/>
      {pending ? <span>Generating form...</span> : "Generate Form"}
    </Button>
  );
};
