import {
    Flex,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import Card from "components/card/Card";
  import Menu from "components/menu/MainMenu";
  
  export default function ColumnsTable(props) {
    const { columnsData } = props;
    const [tableData, setTableData] = useState([]);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:8080/allUsers');
          const { users } = await response.json();
          setTableData(users);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      fetchUsers();
    }, []);
  
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  
    return (
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex px='25px' justify='space-between' mb='20px' align='center'>
          <Text
            color={textColor}
            fontSize='22px'
            fontWeight='700'
            lineHeight='100%'>
            Users
          </Text>
          <Menu />
        </Flex>
        <Table variant='simple' color='gray.500' mb='24px'>
          <Thead>
            <Tr>
              {columnsData.map((column, index) => (
                <Th
                  key={index}
                  borderColor={borderColor}
                  fontSize={{ sm: "10px", lg: "12px" }}
                  color='gray.400'>
                  <Flex justify='space-between' align='center'>
                    {column.Header}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((user, rowIndex) => (
              <Tr key={rowIndex}>
                {columnsData.map((column, colIndex) => (
                  <Td
                    key={colIndex}
                    fontSize={{ sm: "14px" }}
                    minW={{ sm: "150px", md: "200px", lg: "auto" }}
                    borderColor='transparent'>
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {user[column.accessor]}
                    </Text>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    );
  }
  