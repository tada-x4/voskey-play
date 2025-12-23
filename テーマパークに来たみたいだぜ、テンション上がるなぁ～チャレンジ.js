// 自由に複製・改変していただいて構いません。
// CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/deed.ja

let words = [
  "テーマ" "パーク" "テンション"
]

let random1 = Math:gen_rng(`{Date:year()}{Date:month()}{Date:day()}{USER_ID}`)
let random2 = Math:gen_rng(`{Date:year()}{Date:day()}{Date:month()}{USER_ID}`)
let random3 = Math:gen_rng(`{Date:day()}{Date:year()}{Date:month()}{USER_ID}`)

// Misskey 13.10～13.11
// (0 (words.len - 1)) → (0 words.len)

let message1 = words[random1(0, words.len - 1)]
let message2 = words[random2(0, words.len - 1)]
let message3 = words[random3(0, words.len - 1)]

let result = `{message1}{message2}に来たみたいだぜ、{message3}上がるなぁ～`


  Ui:render([
    Ui:C:container({
      children: [
        Ui:C:mfm({ text: result })
        Ui:C:postFormButton({
          text: "投稿する"
          rounded: true
          primary: true
          form: {
            text: `{result}

#テーマパークに来たみたいだぜ、テンション上がるなぁ～チャレンジ
{THIS_URL}`
          }
        })
      ]
    })
  ])
