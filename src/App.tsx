import { ChangeEvent, FormEvent, useState } from "react";
import ProductCard from "./components/ProductCard"
import Modal from "./components/ui/Modal";
import { productList,formInputList } from "./data"
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { IProduct } from "./interfaces";
import { productValidation } from "./validation";
import ErrorMessage from "./components/ErrorMessage";


const App = () => {
  const DefaultProductObj={
  title:'',
    description:'',
    imageURL:'',
    price:'',
    colors:[],
    category:{
      name:'',
      imageURL:'',
    },
  };
  
  const[product,setproduct]=useState<IProduct>(DefaultProductObj);
  const[errors,setErrors]=useState({ 
    title:"",
    description:"",
    imageURL:"",
    price:""
  });
    console.log('errors',errors)

    const [isOpen, setIsOpen] = useState(false)

  const closeModal =()=>setIsOpen(false);
  const {title,description,imageURL,price}=product;
  
  

  const openModal =()=>setIsOpen(true);
  const submitHandler =(event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const errors=productValidation({
      title,
      description,
      imageURL,
      price
    });
    
    
    const HasErrorMSg=Object.values(errors).some(value=>value==='')&& Object.values(errors).every(value=>value==='');
    if(!HasErrorMSg){
      setErrors(errors);
      return;
    }
    console.log('send it again');
  }
 
  const cancel =()=>{
    console.log('cancelled');
    setproduct(DefaultProductObj);
    closeModal();
  }
  const onchangeHandler =(event :ChangeEvent<HTMLInputElement>)=>{
    const {value,name}=event.target;
    setproduct({
      ...product,
      [name]:value,
    });
    setErrors({
      ...errors,
      [name]:'',
    })
  }
  const RenderProductList =productList.map(product => <ProductCard key={product.id} product={product} />);
  const RenderFormInputList=formInputList.map(input => <div className="flex flex-col" key={input.id}>
    <label htmlFor={input.id} className="text-gray-700 font-medium text-sm mb-[1px]">{input.label}</label>
    <Input type="text" id={input.id} name={input.name} value={product[input.name]} onChange={onchangeHandler} />
    <ErrorMessage msg={errors[input.name]} />
  </div>
   )
  
  

  return (
    <main className="container">
              <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={openModal}>ADD</Button>

      <div className="  m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md">
      {RenderProductList}
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal} title="ADD A NEW PRODUCT">
        <form className="space-y-3" onSubmit={submitHandler}>
        {RenderFormInputList}
        <div className="flex items-center space-x-3">
        <Button className="bg-indigo-700 hover:bg-indigo-800">SUBMIT</Button>
        <Button className="bg-gray-400 hover:bg-gray-500" onClick={cancel}>CANCEL</Button>
        </div>
        </form>
        
        </Modal>
      
    </main>
  )
}

export default App
