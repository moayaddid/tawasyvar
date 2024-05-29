import Image from 'next/image'
import React from 'react'

const TableImage = ({src}) => {
  return (
    <Image
    width={75}
    height={75}
    className="object-contain h-[80px]"
    src={src}
    alt="#"
    />
  )
}

export default TableImage