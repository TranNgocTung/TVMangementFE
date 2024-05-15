import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ViewCategory from "./Category/ViewCategory";
import CreateCategory from "./Category/CreateCategory";
import UpdateCategory from "./Category/UpdateCategory";
import ViewProduct from "./View/ViewProduct";
import ProductCategoryList from "./Category/ProductCategoryList";
import ListProduct from "./View/ListProduct";
import Create from "./Form/CreateProduct";
import FormProductUpdate from "./Form/FormProductUpdate";
import SearchForm from "./ControllerProduct/SearchProductName";
import ProductLogin from "./FormRegister/ProductLogin";
import ProductRegister from "./FormRegister/ProductRegister";
function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path={`/`} element={<ProductCategoryList/>}/>
            <Route path={`/view/:id`} element={<ViewCategory/>}/>
            <Route path={`/create`} element={<CreateCategory/>}/>
            <Route path={`/update/:id`} element={<UpdateCategory/>}/>
            <Route path={`/viewProduct/:id`} element={<ViewProduct/>}/>
            <Route path={`/createProduct`} element={<Create/>}/>
            <Route path={`/updateProduct/:id`} element={<FormProductUpdate/>}/>
            <Route path={`/list`} element={<ListProduct/>}/>
            <Route path={`/search`} element={<SearchForm/>}/>
            <Route path={`/register`} element={<ProductRegister/>}/>
            <Route path={`/logins`} element={<ProductLogin/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;
