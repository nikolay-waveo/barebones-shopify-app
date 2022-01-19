import { Button, Heading, TextContainer } from '@shopify/polaris'
import React from 'react'
import { FC, ReactNode, useEffect, useState } from 'react'

interface ISetUpInstructions {
  onFinish(): void,
  skipLabel?: string,
  pages: {
    src: string,
    alt: string,
    title: string | ReactNode,
    content: string | ReactNode,
    prevLabel?: string,
    nextLabel?: string,
    exitLabel?: string,
    jump?: {
      page: number,
      label: string,
    }
  }[],
}

const SetUpInstructions: FC<ISetUpInstructions> = ({
  onFinish,
  skipLabel = 'Skip',
  pages,
}) => {
  const [CurrentPageContent, setCurrentPageContent] = useState(pages[0])
  const [page, setPage] = useState(0)

  useEffect(() => {
    if(page > pages.length - 1) onFinish()
    setCurrentPageContent(pages[page])
  }, [page])

  const {
    src,
    alt,
    title,
    content,
    prevLabel = 'Previous',
    nextLabel = 'Next',
    exitLabel = 'Finish',
    jump,
  } = CurrentPageContent

  const prevPage = () => setPage(page - 1)
  const nextPage = () => setPage(page + 1)
  const jumpPage = () => setPage(jump.page - 1)

  return (
    <div className='flex flex-col content-between h-screen justify-center'>
      { jump && 
        <div className='flex justify-center p-8 pb-0'>
          <div className='flex justify-end max-w-6xl w-full'>
            <Button onClick={jumpPage} plain>{jump.label}</Button>
          </div>
        </div>
      }
      <div className='flex justify-center w-screen p-8'>
        <div className='max-w-6xl'>
          <img className='w-full' src={src} alt={alt} />
        </div>
      </div>
      <div className='flex justify-center p-8'>
        <div className='w-full max-w-4xl justify-end'>
          <div className='flex flex-col space-y-16'>
              { React.isValidElement(title)
                ? title
                : <Heading>{title}</Heading>
              }

              { React.isValidElement(content) 
                ? content 
                : <p>
                    {content}
                  </p>
              }

          </div>
        </div>
      </div>
      <div className='flex justify-center mt-auto p-8 border-0 border-t border-solid'>
        <div className='flex w-full max-w-6xl justify-between gap-2 '>
          <Button onClick={onFinish} plain>{skipLabel}</Button>
          <div className='flex gap-4'>
            { page > 0 && 
              <Button onClick={prevPage}>{prevLabel}</Button>}
              <Button onClick={nextPage} primary>{page < pages.length - 1 ? nextLabel: exitLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetUpInstructions
