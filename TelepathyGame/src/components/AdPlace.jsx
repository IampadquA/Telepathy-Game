import React from 'react'

const AdPlace = ({width,height,className,...props}) => {
  return (
    <aside className={`content-center text-center bg-bgblue bg-opacity-50 border-2 border-borderRed border-opacity-50 ${className}`} style={{width : width,height: height, borderRadius:25}} {...props}>
        <div className='bg-white w-fit ml-8'>Commercial</div>
    </aside>
  )
}

export default AdPlace