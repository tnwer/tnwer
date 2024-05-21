import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export default function Banner(props) {
  const { banner, avatar, name, job, posts, followers, following } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const [userData, setUserData] = useState({
    user_name: '',
    email: '',
    image: '',
    phone_number: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('AdminAccessToken');

      try {
        const response = await fetch('http://localhost:8080/profilePage', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData({
          user_name: data.user_name,
          email: data.user_email,
          image: data.profile_img,
          phone_number: data.phone_number,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        h='131px'
        w='100%'
      />
      <Avatar
        mx='auto'
        src={userData.image}
        h='87px'
        w='87px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {userData.user_name}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
      {userData.email}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
      {userData.phone_number}
      </Text>
    </Card>
  );
}
