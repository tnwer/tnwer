import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from 'axios';

import Banner from "views/admin/marketplace/components/Banner";
import NFT from "components/card/NFT";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");

  useEffect(() => {
    // Fetch all products from the API
    axios.get('http://localhost:8080/allProducts')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching all products:', error);
      });

    // Fetch recent products from the API
    axios.get('http://localhost:8080/deletedProducts')
      .then(response => {
        setRecentProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching recent products:', error);
      });
  }, []);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "" }}
        >
          <Banner />
          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                All products
              </Text>
              <Flex
                align="center"
                me="20px"
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}
              >
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#art"
                >
                  Art
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#music"
                >
                  Music
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#collectibles"
                >
                  Collectibles
                </Link>
                <Link color={textColorBrand} fontWeight="500" to="#sports">
                  Sports
                </Link>
              </Flex>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 4 }} gap="15px" justifyItems={'center'}>
              {products.map(product => (
                <NFT
                  key={product._id}
                  name={product.product_name}
                  author={`By ${product.shop_name}`}
                  image={product.img_url}
                  currentbid={`${product.price}`} // Assuming price is in ETH
                  download="#"
                  // Add styling to make the card smaller
                  sx={{
                    maxWidth: "300px",
                    maxHeight: "400px",
                  }}
                />
              ))}
            </SimpleGrid>
            <Text
              mt="45px"
              mb="36px"
              color={textColor}
              fontSize="2xl"
              ms="24px"
              fontWeight="700"
            >
              deleted products
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb={{ base: "20px", xl: "0px" }}>
              {recentProducts.map(product => (
                <NFT
                  key={product._id}
                  name={product.product_name}
                  author={`By ${product.shop_name}`}
                  image={product.img_url}
                  currentbid={`${product.price} ETH`} // Assuming price is in ETH
                  sx={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                  }}
                />
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}
