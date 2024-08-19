import React, { useEffect } from 'react'
import { useState ,useCallback } from 'react'
import { FaArrowRight } from "react-icons/fa";
import {motion} from "framer-motion"
import { getInventory,getInventorys } from '../FirebaseFunctions';

const Inventory = ( {selectedInventory} ) => {

    const [subInventoryCategorys,setSubInventoryCategorys] = useState([]);
    const [subInventoryCategory,setSubInventoryCategory] = useState("")
    const [searchTerm,setSearchTerm] = useState("");
    const [inventorys,SetInventorys] = useState([]);
    const [items,SetItems] = useState([]);

    useEffect(() => {
      SetItems([]);

      const fetchAndSetInventorys = async () => {

        const data = await getInventorys();
        SetInventorys(data);

        const selectedInventoryData = data.find(inventory => inventory.InventoryName == selectedInventory);
      
        
        if (selectedInventory){
          const inventoryItems = await getInventory(selectedInventoryData.id,selectedInventory);
          console.log("Inventoryıtems" , inventoryItems)
          SetItems(inventoryItems);
          const subCategorys = selectedInventoryData.subCategorys;
          setSubInventoryCategorys(subCategorys);
          setSubInventoryCategory(subCategorys[0]);
        }else{
          console.log("smhwt went wrong with if");
        }


        
      };
      fetchAndSetInventorys();
      
    }, [selectedInventory])
    
    const filteredDatafromSearch = useCallback(() => {
      console.log("Items:",items)
        return items.filter(item =>
          item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [items, searchTerm]);

    const filteredDatafromsubCategory = useCallback(() => {
      return items.filter(item => item.subCategory[0] === subInventoryCategory);
    },[items,subInventoryCategory]);

    const filteredData = useCallback(() => {
      if (searchTerm === ""){
        return  filteredDatafromsubCategory();
      }
      else {
        return  filteredDatafromSearch();
      }
    }, [searchTerm, filteredDatafromSearch, filteredDatafromsubCategory])

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    };

    function handleCategoryChange(direction) {
      // SubInventoryCategorys dizisinde mevcut subInventoryCategory'nin indeksini bul
      const currentIndex = subInventoryCategorys.indexOf(subInventoryCategory);
      
      // Geçerli indeksi kontrol et ve bir sonraki indeksi hesapla
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % subInventoryCategorys.length;
      } else if (direction === 'prev') {
        newIndex = (currentIndex - 1 + subInventoryCategorys.length) % subInventoryCategorys.length;
      }
      
      // Yeni kategori ayarla
      setSubInventoryCategory(subInventoryCategorys[newIndex]);
    }

  return (
    <div className='relative bg-opacity-30 bg-bgdarkerdarkerblue border-2 my-8 p-4 ' style={{width : 920,height : 380, borderRadius: 25 , borderColor : '#643236', backdropFilter: 'blur(20px)'}}>
    <h2 className='mx-3 mb-3 text-Error-text '> {items.length > 0 && items[0].subCategory ? subInventoryCategory : "Loading..."}</h2>
    <input 
        className='flex w-full overflow-hidden border-borderRed bg-bgdarkblue bg-opacity-50 text-white font-normal text-base justify-center items-center p-2' 
        style={{ maxWidth: 408, borderWidth: 1 }}
        placeholder='Search'
        value={searchTerm}
        onChange={handleSearchChange}
    ></input>
    <div className='relative flex flex-wrap gap-2 w-full h-full max-h-48 my-3 mb-8 p-2 px-8 ' style={{scrollbarWidth: 'none', overflowY : 'scroll' , overflowX : 'visible'}}>
        {filteredData().map(item => (
            <div className="relative max-w-16 max-h-16 flex flex-col " key={item.id}>
                <motion.img src={item.ImgRef}  alt={item.ItemName}  whileHover={{ scale: 1.1 }}/>
                <motion.div 
                    className='absolute w-16 h-full z-20'
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1}}
                    > 
                    <motion.div
                        className="absolute bg-bgdarkblue text-txtwh left-20 top-1 p-4 text-wrap overflow-hidden pointer-events-none"
                        style={{borderRadius : 25 , transformOrigin : "left"}}
                    >
                        {item.ItemName}
                    </motion.div>
                </motion.div>
            </div>
        ))}
    </div>
    <div className='flex justify-around w-full text-Error-text'>
      <motion.button whileHover={{scale : 1.2}} className='flex w-8 h-8 justify-center items-center'onClick={() => handleCategoryChange("prev")}>
        <FaArrowRight className='rotate-180'/>
      </motion.button>
      <motion.button whileHover={{scale : 1.2}}className='flex w-8 h-8 justify-center items-center'onClick={() => handleCategoryChange("next")}>
        <FaArrowRight/>
      </motion.button>
    </div>
  </div>
  )
}

export default Inventory