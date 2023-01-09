import { lowerCase } from '../../utils/functions'

import styles from './style.module.scss'

interface HighlightableTextProps {
  text: string
  snippet: string
}

export const HighlightableText = ({ text, snippet }: HighlightableTextProps) => {
  if(snippet.length === 0) return <>{text}</>
  else {
    // unhighlighted text array
    const splitedText = text.split(new RegExp(snippet, 'i')) 
    // highlighted text array
    const matches: string[] = []
    let position: number = -1

    do {
      const initialIndex = lowerCase(text).indexOf(lowerCase(snippet), position + 1)
      const finalIndex = initialIndex + snippet.length
      if(initialIndex !== -1) matches.push(text.substring(initialIndex, finalIndex))
      position = initialIndex
    } while(position !== -1)

    return <span>
      {
        splitedText.map((unhighlightedText, index) => {
          const isLastText = index === splitedText.length - 1

          if(isLastText) return <span key={index}>{unhighlightedText}</span>

          return (
            <span key={index}>
              {unhighlightedText}<span className={styles.highlighted_text}>{
                matches[index]
              }</span>
            </span>
          )
        }) 
      }
    </span>
  }
}
