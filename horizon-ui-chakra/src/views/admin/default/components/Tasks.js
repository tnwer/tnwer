import {
    Box,
    Flex,
    Text,
    Icon,
    useColorModeValue,
    Input,
    Button,
    IconButton,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
  } from "@chakra-ui/react";
  import Card from "components/card/Card.js";
  import Menu from "components/menu/MainMenu";
  import IconBox from "components/icons/IconBox";
  
  import { MdCheckBox, MdDragIndicator, MdDelete } from "react-icons/md";
  import React, { useEffect, useState, useRef } from "react";
  
  export default function Conversion(props) {
    const { ...rest } = props;
    const [categories, setCategories] = useState([]);
    const [category_name, setNewCategory] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const cancelRef = useRef();
  
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
    const brandColor = useColorModeValue("brand.500", "brand.400");
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch("http://localhost:8080/getCategory");
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      fetchCategories();
    }, []);
  
    const handleAddCategory = async () => {
      if (!category_name.trim() || !selectedImage) return;
  
      const formData = new FormData();
      formData.append("category_name", category_name);
      formData.append("image", selectedImage);
  
      try {
        const response = await fetch("http://localhost:8080/addCategory", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setCategories([...categories, data.category]);
        setNewCategory("");
        setSelectedImage(null);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    };
  
    const handleDeleteCategory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/deleteCategory/${selectedCategory._id}`, {
          method: "PUT",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        setCategories(categories.filter((category) => category._id !== selectedCategory._id));
        setSelectedCategory(null);
        setIsOpen(false);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };
  
    const openDeleteDialog = (category) => {
      setSelectedCategory(category);
      setIsOpen(true);
    };
  
    const closeDeleteDialog = () => {
      setSelectedCategory(null);
      setIsOpen(false);
    };
  
    return (
      <Card p="20px" align="center" direction="column" w="100%" {...rest}>
        <Flex alignItems="center" w="100%" mb="30px">
          <IconBox
            me="12px"
            w="38px"
            h="38px"
            bg={boxBg}
            icon={<Icon as={MdCheckBox} color={brandColor} w="24px" h="24px" />}
          />
          <Text color={textColor} fontSize="lg" fontWeight="700">
            Categories
          </Text>
          <Menu ms="auto" />
        </Flex>
        <Box px="11px" w="100%">
          {categories.map((category) => (
            <Flex mb="20px" key={category._id} alignItems="center">
              <Text
                fontWeight="bold"
                color={textColor}
                fontSize="md"
                textAlign="start"
                flex="1"
              >
                {category.category_name}
              </Text>
              <IconButton
                aria-label="Delete category"
                icon={<MdDelete />}
                colorScheme="red"
                onClick={() => openDeleteDialog(category)}
                ms="auto"
              />
              <Icon
                as={MdDragIndicator}
                color="secondaryGray.600"
                w="24px"
                h="24px"
                ml="8px"
              />
            </Flex>
          ))}
          <Flex mt="20px" alignItems="center">
            <Input
              placeholder="New Category"
              value={category_name}
              onChange={(e) => setNewCategory(e.target.value)}
              me="8px"
              name="category_name"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              me="8px"
              name="image"
            />
            <Button colorScheme="brand" onClick={handleAddCategory}>
              Add Category
            </Button>
          </Flex>
        </Box>
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeDeleteDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Category
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure you want to delete this category? This action cannot be undone.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeDeleteDialog}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteCategory} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Card>
    );
  }
  