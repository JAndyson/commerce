import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import dynamic from 'next/dynamic'
import {
  Tab,
  Tabs,
  RadioGroup,
  Radio,
  FormGroup,
  InputGroup,
  NumericInput,
} from '@blueprintjs/core'
import { send } from 'process'
import App from '@components/common/TxBuilder'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const TxBuilder = dynamic(() => import('@components/common/TxBuilder'), {
  ssr: false,
})

const CryptoForm = dynamic(() => import('@components/common/CryptoForm'), {
  ssr: false,
})

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const addItem = useAddItem()
  const { openSidebar, setSidebarView } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  const [isSubmittedTxHashSet, setIsSubmittedTxHashSet] = useState(false)
  let e: any

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const updateSubmittedTxHashSet = (isSubmittedTxHash: boolean) => {
    console.log('updateSubmittedTxHashSet', isSubmittedTxHash)
    setIsSubmittedTxHashSet(isSubmittedTxHash)
    if (isSubmittedTxHash) {
      handleSubmit(e)
    }
  }

  //  useEffect(() => {}, [isSubmittedTxHashSet])
  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0]?.id),
      })
      setSidebarView('CART_VIEW')
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  // States for contact form fields
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('')

  //   Form validation state
  const [errors, setErrors] = useState({})

  //   Setting button text on form submission
  const [buttonText, setButtonText] = useState('Send')

  // Setting success or failure messages states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showFailureMessage, setShowFailureMessage] = useState(false)

  // Validation check method
  const handleValidation = () => {
    let tempErrors = {} as any
    let isValid = true

    if (fullname.length <= 0) {
      tempErrors['fullname'] = true
      isValid = false
    }
    if (email.length <= 0) {
      tempErrors['email'] = true
      isValid = false
    }
    if (message.length <= 0) {
      tempErrors['message'] = true
      isValid = false
    }

    setErrors({ ...tempErrors })
    console.log('errors', errors)
    return isValid
  }

  //   Handling form submit

  const handleSubmit = async (e: any) => {
    e?.preventDefault()
    console.log('handleSubmit is called---')
    let isValidForm = handleValidation()

    if (isValidForm) {
      setButtonText('Sending')
      const res = await fetch('/api/sendgrid', {
        body: JSON.stringify({
          email: email,
          fullname: fullname,
          subject: product.name,
          message: message,
          address: address,
          color: selectedOptions.color,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { error } = await res.json()
      if (error) {
        console.log(error)
        setShowSuccessMessage(false)
        setShowFailureMessage(true)
        setButtonText('Send')
        return
      }
      setShowSuccessMessage(true)
      setShowFailureMessage(false)
      setButtonText('Send')
    }
    console.log(fullname, email, subject, message)
  }

  return (
    <div className={className}>
      <ProductOptions
        options={product.options}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.descriptionHtml || product.description}
      />
      <div className="flex flex-row justify-between items-center">
        <Rating value={5} />
        <div className="text-accent-6 pr-1 font-medium text-sm">36 reviews</div>
      </div>
      <div>
        {process.env.COMMERCE_CART_ENABLED && (
          <Button
            aria-label="Add to Cart"
            type="button"
            className={s.button}
            onClick={addToCart}
            loading={loading}
            disabled={variant?.availableForSale === false}
          >
            {variant?.availableForSale === false
              ? 'Not Available'
              : 'Add To Cart'}
          </Button>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg shadow-xl flex flex-col px-8 py-8 bg-black dark:bg-blue-500"
      >
        <h1 className="text-2xl font-bold dark:text-gray-50">
          Checkout with crypto!
        </h1>

        <label
          htmlFor="fullname"
          className="text-gray-500 font-light mt-8 dark:text-gray-50"
        >
          Full Name<span className="text-red-500 dark:text-gray-50">*</span>
        </label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value)
          }}
          name="fullname"
          className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-gray-500"
        />

        <label
          htmlFor="email"
          className="text-gray-500 font-light mt-4 dark:text-gray-50"
        >
          E-mail<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-gray-500"
        />

        <label
          htmlFor="address"
          className="text-gray-500 font-light mt-4 dark:text-gray-50"
        >
          Address for shipping<span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
          }}
          className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-gray-500"
        ></textarea>

        <label
          htmlFor="message"
          className="text-gray-500 font-light mt-4 dark:text-gray-50"
        >
          Paste your wallet address
          <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          className="bg-transparent border-b py-2 pl-4 focus:outline-none focus:rounded-md focus:ring-1 ring-green-500 font-light text-gray-500"
        ></textarea>
      </form>
      <TxBuilder
        setIsSubmittedTxHashSet={updateSubmittedTxHashSet}
        product={product}
      />
    </div>
  )
}

export default ProductSidebar
