"use client";

import { ProductType } from "@/app/(dashboard)/dashboard/types/apps/ecommerce";
import { getFetcher } from "@/app/api/global-fetcher";
import React, { createContext, useState, useEffect } from "react";

import useSWR from "swr";

interface ProductContextType {
  products: ProductType[];
  searchProduct: string;
  selectedCategory: string;
  sortBy: string;
  priceRange: string;
  selectedGender: string;
  selectedColor: string;
  loading: boolean;
  error: any;
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
  setSearchProduct: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setPriceRange: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGender: React.Dispatch<React.SetStateAction<string>>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  deleteProduct: (productId: number | string) => void;
  searchProducts: (searchText: string) => void;
  updateSortBy: (sortOption: string) => void;
  updatePriceRange: (range: string) => void;
  selectCategory: (category: string) => void;
  selectGender: (gender: string) => void;
  selectColor: (color: string) => void;
  deleteAllProducts: () => void;
  filteredAndSortedProducts: ProductType[];
  filterReset: () => void;
  getProductById: (productId: string) => ProductType | undefined;
  updateProduct: (productId: string, updatedProduct: ProductType) => void;
}

export const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType,
);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [priceRange, setPriceRange] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useSWR("/api/ecommerce", getFetcher);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data);
      setLoading(isProductsLoading);
    } else if (productsError) {
      setError(productsError);
      setLoading(isProductsLoading);
    } else {
      setLoading(isProductsLoading);
    }
  }, [productsData, productsError, isProductsLoading]);

  const filterProducts = (product: ProductType) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchProduct.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category.includes(selectedCategory);
    const withinPriceRange =
      priceRange === "All" ||
      (priceRange === "0-50" && product.price <= 50) ||
      (priceRange === "50-100" && product.price > 50 && product.price <= 100) ||
      (priceRange === "100-200" &&
        product.price > 100 &&
        product.price <= 200) ||
      (priceRange === "200-99999" && product.price > 200);
    const matchesGender =
      selectedGender === "All" || product.gender === selectedGender;
    const matchesColor =
      selectedColor === "All" || product.colors.includes(selectedColor);

    return (
      matchesSearch &&
      matchesCategory &&
      withinPriceRange &&
      matchesGender &&
      matchesColor
    );
  };

  const sortProducts = (filteredProducts: ProductType[]) => {
    switch (sortBy) {
      case "newest":
        return filteredProducts.sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );
      case "priceDesc":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "priceAsc":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "discount":
        return filteredProducts.sort(
          (a, b) => (b.discount || 0) - (a.discount || 0),
        );
      default:
        return filteredProducts;
    }
  };

  const getProductById = (productId: string) => {
    return products.find((p) => p.id === Number(productId));
  };

  const filteredProducts = products.filter(filterProducts);
  const filteredAndSortedProducts = sortProducts(filteredProducts);

  const selectCategory = (category: string) => setSelectedCategory(category);
  const updateSortBy = (sortOption: string) => setSortBy(sortOption);
  const updatePriceRange = (range: string) => setPriceRange(range);
  const selectGender = (gender: string) => setSelectedGender(gender);
  const selectColor = (color: string) => setSelectedColor(color);
  const searchProducts = (searchText: string) => setSearchProduct(searchText);

  const deleteProduct = (productId: number | string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const deleteAllProducts = () => {
    setProducts([]);
  };

  const updateProduct = (productId: string, updatedProduct: ProductType) => {
    setProducts(
      products.map((product) =>
        product.id === Number(productId) ? updatedProduct : product,
      ),
    );
  };

  const filterReset = () => {
    setSelectedCategory("All");
    setSelectedColor("All");
    setSelectedGender("All");
    setPriceRange("All");
    setSortBy("newest");
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        searchProduct,
        selectedCategory,
        sortBy,
        priceRange,
        selectedGender,
        selectedColor,
        loading,
        error,
        setProducts,
        setSearchProduct,
        setSelectedCategory,
        setSortBy,
        setPriceRange,
        setSelectedGender,
        setSelectedColor,
        setLoading,
        deleteProduct,
        searchProducts,
        updateSortBy,
        updatePriceRange,
        selectCategory,
        selectGender,
        selectColor,
        deleteAllProducts,
        filteredAndSortedProducts,
        filterReset,
        getProductById,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
