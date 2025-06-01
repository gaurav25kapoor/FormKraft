import SubmissionsDetails from '@/components/SubmissionsDetails'
import React from 'react'
import prisma from "@/lib/prisma";

const page = async({params}:{params:Promise<{formId:string}>}) => {

  const formId=(await params).formId
  const submissions=await prisma.submissions.findMany({
    where:{
      formId:Number(formId)
    },
    include:{
      form:true
    }
  })

  if(!submissions || submissions.length===0){
    return(<h1>No submissions found for Form id {formId}</h1>)
  }
  return (
    <div>
      {
        submissions.map((submission:any,index:number)=>(
           <SubmissionsDetails key={index} submission={submission} index={index}/>
        ))
      }
    </div>
  )
}

export default page