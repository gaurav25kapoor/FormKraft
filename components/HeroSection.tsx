"use client"
import React, { useState } from "react";

import { Button } from "./ui/button";
import GenerateFormInput from "./GenerateFormInput";

type SuggestionText = {
  label: string;
  text: string;
};

const suggestionBtnText: SuggestionText[] = [
  {
    label: "Job Application",
    text: "Develop a basic job application form that serves as a one-page solution form collecting essential information from applicants.",
  },
  {
    label: "Registration Form",
    text: "Create a course registration form suitable form any scheool or instituition.",
  },
  {
    label: "Feedback Form",
    text: "Create a client feedback form to gather valuable insights from any clients.",
  },
];

const HeroSection = () => {
  const [text,setText]=useState<string>("");
  return (
    <section>
      <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-50 -z-10"></div>
        <div className="container mx-auto text-center relative">
        <h1 className="text-4xl font-bold">
          Build AI-Driven Forms Effortlessly
        </h1>
        <p className="mt-4 text-lg">
          Levrage the power of AI to create responsive and dynamic forms in
          minutes
        </p>
      </div>
      </div>
      <GenerateFormInput text={text}/>
      <div className="grid grid-cols-4 gap-3">
        {
        suggestionBtnText.map((item:SuggestionText,index:number)=>(
          <Button onClick={()=>setText(item.text)} key={index} variant={'outline'} className="rounded-full h-10 cursor-pointer">{item.label}</Button>
        ))
      }
      </div>
      
      
    </section>
  );
};

export default HeroSection;
