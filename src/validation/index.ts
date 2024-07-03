

export const productValidation =(product:{ title:'',
    description:'',
    imageURL:'',
    price:''})=>{
        const errors :{title:string,description:string,imageURL:string,price:string}={
            title:'',
    description:'',
    imageURL:'',
    price:''
        };
    
    const validurl=/^(ftp|http|https):\/\/[^ "]+$/.test(product.imageURL);
        if(!product.title.trim() || product.title.length <10 || product.title.length >80){
            errors.title='Product Title Must be between 10 and 80 characters !';
        }
        if(!product.description.trim() || product.description.length <10 || product.description.length >900){
            errors.description='Product Description Must be between 10 and 900 characters !';
        }
        if(!product.imageURL.trim() || !validurl){
            errors.imageURL="Valid image URL IS Required !"
        }
        if(!product.price.trim() || isNaN(Number(product.price))){
            errors.price="Valid Price IS Required !"
        }
        return errors;

}