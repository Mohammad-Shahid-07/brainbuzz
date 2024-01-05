import { AlertTriangleIcon } from "lucide-react"
import { Card, CardFooter, CardHeader } from "../ui/card"
import { BackButton } from "./BackButton"
import { CardWrapper } from "./CardWrapper"
import { Header } from "./header"

export const ErrorCard = () => {
  return (
   <CardWrapper
   headerLabel="Oops! Something went wrong"
   BackButtonHref="/login"
   BackButtonLabel="Back to login"
   >
    <div className="w-full flex justify-center items-center">
        <AlertTriangleIcon className="text-red-500" />
    </div>
   </CardWrapper>
  )
}

