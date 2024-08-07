import { v4 as uuid } from "uuid";
import { IProduct } from "./interfaces";
import Modal from "./components/ui/Modal";
import Input from "./components/ui/Input";
import Select from "./components/ui/select";
import Button from "./components/ui/Button";
import toast, { Toaster } from "react-hot-toast";
import { productValidation } from "./validation";
import CircleColor from "./components/CircleColor";
import ErrorMessage from "./components/ErrorMessage";
import ProductsCard from "./components/ProductCard";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { categories, colors, formInputList, productList } from "./data";
import { TProductNameSchema } from "./components/types";

const App = () => {
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      name: "",
      imageURL: "",
    },
  };
  /* -------- STATE -------- */
  const [selectedCategory, setSelectedCategory] = useState(categories[2]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [productToEditIdx, setProductToEditIdx] = useState<number>(0);
  const [product, setProduct] = useState<IProduct>(defaultProductObj);
  const [products, setProducts] = useState<IProduct[]>(productList);
  const [tempColors, setTempColors] = useState<string[]>([]);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productToEdit, setProductToEdit] =
    useState<IProduct>(defaultProductObj);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
  });

  /* -------- HANDLER -------- */
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openEditModal = useCallback(() => setIsOpenEdit(true), []);
  const closeEditModal = () => setIsOpenEdit(false);

  const openConfirmModal = useCallback(() => setIsOpenConfirmModal(true), []);
  const closeConfirmModal = () => setIsOpenConfirmModal(false);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const onChangeEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setProductToEdit({
      ...productToEdit,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const onCancel = () => {
    setProduct(defaultProductObj);
    closeModal();
  };

  const onEditCancel = () => {
    setProduct(defaultProductObj);
    closeEditModal();
  };

  const removeProductHandler = () => {
    const filtered = products.filter(
      (product) => product.id !== productToEdit.id
    );
    setProducts(filtered);
    closeConfirmModal();
    toast.success("Product has been deleted!", {
      duration: 5000,
    });
  };

  const sumbitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { title, description, imageURL, price } = product;

    const errors = productValidation({
      title,
      description,
      imageURL,
      price,
    });

    const hasErrorMsg =
      Object.values(errors).some((value) => value === "") &&
      Object.values(errors).every((value) => value === "");
    if (!hasErrorMsg) {
      setErrors(errors);
      return;
    }

    setProducts((prev) => [
      {
        ...product,
        id: uuid(),
        colors: tempColors,
        category: selectedCategory,
      },
      ...prev,
    ]);
    setProduct(defaultProductObj);
    setTempColors([]);
    closeModal();
    toast.success("Product is add to List!", {
      duration: 5000,
    });
  };

  const sumbitEditHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { title, description, imageURL, price } = productToEdit;

    const errors = productValidation({
      title,
      description,
      imageURL,
      price,
    });

    const hasErrorMsg =
      Object.values(errors).some((value) => value === "") &&
      Object.values(errors).every((value) => value === "");
    if (!hasErrorMsg) {
      setErrors(errors);
      return;
    }

    const updatedProducts = [...products];
    updatedProducts[productToEditIdx] = {
      ...productToEdit,
      colors: tempColors.concat(productToEdit.colors),
    };
    setProducts(updatedProducts);

    setProductToEdit(defaultProductObj);
    setTempColors([]);
    closeEditModal();
    toast.success("Product has been Edit!", {
      duration: 5000,
    });
  };

  /* -------- RENDER -------- */
  const renderProductList = products.map((product, idx) => (
    <ProductsCard
      idx={idx}
      key={product.id}
      product={product}
      openEditModal={openEditModal}
      openConfirmModal={openConfirmModal}
      setProductToEdit={setProductToEdit}
      setProductToEditIdx={setProductToEditIdx}
    />
  ));

  const renderFormInputList = formInputList.map((input) => (
    <div className="flex flex-col" key={input.id}>
      <label
        htmlFor={input.id}
        className="mb-[1px] text-sm font-medium text-gray-700"
      >
        {input.label}
      </label>
      <Input
        type={input.type}
        id={input.id}
        name={input.name}
        value={product[input.name]}
        onChange={onChangeHandler}
      />
      <ErrorMessage msg={errors[input.name]} />
    </div>
  ));

  const renderProductColors = colors.map((color) => (
    <CircleColor
      key={color}
      color={color}
      onClick={() => {
        if (tempColors.includes(color)) {
          setTempColors((prev) => prev.filter((item) => item !== color));
          return;
        }
        if (productToEdit.colors.includes(color)) {
          setTempColors((prev) => prev.filter((item) => item !== color));
          return;
        }
        setTempColors((prev) => [...prev, color]);
      }}
    />
  ));

  const renderProductToEditWithErrorMsg = (
    id: string,
    label: string,
    name: TProductNameSchema,
  ) => {
    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="mb-[1px] text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <Input
          type="text"
          id={id}
          name={name}
          value={productToEdit[name]}
          onChange={onChangeEditHandler}
        />
        <ErrorMessage msg={errors[name]} />
      </div>
    );
  };

  return (
    <main className="container">
      <div className="flex flex-row justify-between items-center m-5 p-2">
        <h2 className="text-black flex-1 text-3xl font-medium">
          Latest <span className="text-indigo-700">Products</span>
        </h2>
        <Button
          className="bg-indigo-700 hover:bg-indigo-800 mx-auto my-10 px-10 font-medium"
          onClick={() => openModal()}
          cardWidth="w-fit"
        >
          Build now!
        </Button>
      </div>
      <div className="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-4 p-2 rounded-md">
        {renderProductList}
      </div>
      {/* -------- ADD PRODUCT MODAL -------- */}
      <Modal isOpen={isOpen} closeModal={closeModal} title="Add a new Product!">
        <form className="space-y-3" onSubmit={sumbitHandler}>
          {renderFormInputList}
          <Select
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
          <div className="flex items-center my-4 space-x-1">
            {renderProductColors}
          </div>
          <div className="flex items-center my-4 space-x-1">
            {tempColors.map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                className="p-1 mr-1 mb-1 text-xs rounded-md text-white"
              >
                {color}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              Submit
            </Button>
            <Button
              className="bg-gray-600 hover:bg-gray-700"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* -------- EDIT PRODUCT MODAL -------- */}
      <Modal
        isOpen={isOpenEdit}
        closeModal={closeEditModal}
        title="Edit this Product!"
      >
        <form className="space-y-3" onSubmit={sumbitEditHandler}>
          {renderProductToEditWithErrorMsg("title", "Product Title", "title")}
          {renderProductToEditWithErrorMsg(
            "description",
            "Product Description",
            "description"
          )}
          {renderProductToEditWithErrorMsg(
            "imageURL",
            "Product ImageURL",
            "imageURL"
          )}
          {renderProductToEditWithErrorMsg("price", "Product Price", "price")}
          <Select
            selected={productToEdit.category}
            setSelected={(value) =>
              setProductToEdit({ ...productToEdit, category: value })
            }
          />
          <div className="flex items-center my-4 space-x-1">
            {renderProductColors}
          </div>
          <div className="flex items-center my-4 space-x-1">
            {tempColors.concat(productToEdit.colors).map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                className="p-1 mr-1 mb-1 text-xs rounded-md text-white"
              >
                {color}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">
              Submit
            </Button>
            <Button
              className="bg-gray-600 hover:bg-gray-700"
              onClick={() => onEditCancel()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* -------- DELETE PRODUCT CONFIRM MODAL -------- */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Product from your Store?"
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button
            className="bg-[#c2344d] hover:bg-red-800"
            onClick={removeProductHandler}
          >
            Yes, remove
          </Button>
          <Button
            className="bg-gray-600 hover:bg-gray-700 text-black"
            onClick={closeConfirmModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Toaster />
    </main>
  );
};

export default App;
