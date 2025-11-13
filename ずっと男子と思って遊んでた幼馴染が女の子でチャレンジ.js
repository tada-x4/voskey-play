// 自由に複製・改変していただいて構いません。
// CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/deed.ja

let words = [
  "ずっと" "男子" "思って" "遊んでた" "幼馴染" "女の子" 
]

let random1 = Math:gen_rng(`{Date:year()}{Date:month()}{Date:day()}{USER_ID}`)
let random2 = Math:gen_rng(`{Date:year()}{Date:day()}{Date:month()}{USER_ID}`)
let random3 = Math:gen_rng(`{Date:day()}{Date:year()}{Date:month()}{USER_ID}`)
let random4 = Math:gen_rng(`{Date:month()}{Date:day()}{Date:year()}{USER_ID}`)
let random5 = Math:gen_rng(`{Date:month()}{Date:year()}{Date:day()}{USER_ID}`)
let random6 = Math:gen_rng(`{Date:day()}{Date:month()}{Date:year()}{USER_ID}`)

// Misskey 13.10～13.11
// (0 (words.len - 1)) → (0 words.len)

let message1 = words[random1(0, words.len - 1)]
let message2 = words[random2(0, words.len - 1)]
let message3 = words[random3(0, words.len - 1)]
let message4 = words[random4(0, words.len - 1)]
let message5 = words[random5(0, words.len - 1)]
let message6 = words[random6(0, words.len - 1)]

let result = `{message1}{message2}と{message3}{message4}{message5}が{message6}で
#ずっと男子と思って遊んでた幼馴染が女の子でチャレンジ
{THIS_URL}`


  Ui:render([
    Ui:C:container({
      children: [
        Ui:C:mfm({ text: result })
        Ui:C:postFormButton({
          text: "投稿する"
          rounded: true
          primary: true
          form: {
            text: `{result}`
          }
        })
      ]
    })
  ])