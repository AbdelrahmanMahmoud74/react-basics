import { IProduct } from "../interfaces"
import Image from "./image"
import Button from "./ui/Button"
import { txtslicer } from "../utils/functions"

interface IProps {
  product:IProduct

}

const ProductCard = ({product}:IProps) => {
  const {title,imageURL,description,price,category}=product;
  return (
    <div className=" border rounded-md p-2 flex flex-col max-w-sm md:max-w-lg mx-auto md:mx-0">
       <Image imageUrl={imageURL}
       alt={"Product Name"} className="rounded-md mb-2" />
      <h3>{title} </h3>
      <p>{txtslicer(description)}</p>
    <div className="flex items-center my-4 space-x-2" >
        
        <span className="w-5 h-5 bg-indigo-500 rounded-full "></span>
        <span className="w-5 h-5 bg-yellow-500 rounded-full  "></span>
        <span className="w-5 h-5 bg-red-500 rounded-full "></span>
    </div>
    <div className="flex items-center justify-between">
        <span>{price}</span>
        <Image imageUrl={category.imageURL}
       alt={category.name} className="h-10 w-10 rounded-full object-center" />
        
     
    </div>
    <div className="flex items-center justify-between space-x-2 mt-5">
        <Button onClick={()=>alert("عبدالرحمن محمود يتمني لك يوما سعيدا")} className=" bg-indigo-700 ">EDIT</Button>
        <Button className=" bg-red-700 w-full">DELETE</Button>
        
    </div>
    </div>
  )
}

export default ProductCard
