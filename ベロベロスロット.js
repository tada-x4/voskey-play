//参考元
//ブルアカスロットPlay
//https://misskey.io/play/a8zgeyn639y2092h

//modified by @fried_butter@voskey.icalo.net

// Playの名前
let name = "ベロベロスロットPlay"
// 大当たりにする絵柄
let big = ":berobero_aoi:"
// 中当たりにする絵柄
let reg = ":berobero_minato:"
// 広い幅の絵柄リスト
let wide = [
	":berobero_aoi:",
	":berobero_minato:",
	":berobero_karogado:",
	":berobero_sayo:",
	":berobero_turugi:",
	":berobero_doro_minato:",
]
// 狭い幅の絵柄リスト※ガタつかないよう広い幅の絵柄の半数以下にする
let narrow = []
// 絵柄リスト※合計3個以上21個以下
let symbols = wide.concat(narrow)
// 結果テキストリスト
let result_texts = {
  lose: ":faa_kiritan::hazure:", // ハズレ
  hit: ":igyo_english:", // 当たり
  reg: `:_ti::_lyu::_u::_a::_ta::_ri:‼️:berobero_minato:$[sparkle :igyo_wide_yuru:]`, // 中当たり
  big: `$[sparkle :_o::_o::_a::_ta::_ri:‼️$[tada :berobero_aoi:]$[tada.speed=0s :igyo_ultra:]]`, // 大当たり
  fake: ":faaaaaaa_kiritan:", // リーチしてハズレた時
  reg_fake: ":minato_heaven::freeze_minato::minato_heaven:", // 中当たりリーチしてハズレた時
  big_fake: ":naname_aoi::crossmark_aoi::naname_aoi:" // 大当たりリーチしてハズレた時
  g_fake_hit: ":eentyau_akane::eenyo_tsuina::eeyan_akane::eentyau::eenyade:", // 中・大当たりリーチして通常の当たりになった時
  g_fake_reg: `$[tada :tikai_minato::tikai_minato::tikai_minato::tikai_minato::tikai_minato:]`, // 大当たりリーチして中当たりになった時
}
// 途中で表示するテキストのリスト
let mid_result = {
  lose: "$[flip.v $[jump.speed=10s $[flip.v :dj_aichan::akane_dj::aoi_dj::kotone_dj::moca_dj::one_dj::yukari_nagi_dj:]]]", // 確実にハズレの時
  hit: "$[rainbow $[fg.color=00aeef $[font.serif $[tada.speed=.5s **リーチ‼︎**]]]]:inori_kiritan:", // リーチしている時
  reg: "$[rainbow $[fg.color=00aeef $[font.serif $[tada.speed=.5s **リーチ‼︎**]]]]$[sparkle :inori_kiritan:]", // 中当たりの可能性がある時
  big: "$[shake.speed=1.5s :gekiatu:$[rainbow $[fg.color=00aeef $[font.serif $[tada.speed=0s $[position.y=.175 **リーチ!!**]]]]]]$[sparkle :inori_kiritan:]", // 大当たりの可能性がある時
}
// 3つのインデックスのリスト
let idx_list = [ 0, 1, 2 ]
// リロード対策
let UUID = Util:uuid()
let buttons_id = `b{UUID}`
let reels_id = `r{UUID}`

// リール全体のmfmテキストを返す関数
@reels_mfm(set_list){
  return [ "$[border.noclip,color=000,width=2,radius=3 $[bg.color=fff ", set_list.slice(0, 3), set_list.slice(3, 6), set_list.slice(6, 9), "]]" ].map(@(v, i){
     return if (i < 1 || 3 < i) { v } else { `$[border.noclip,color=ddd,width=.5 $[border.noclip,color=fff,width=.5 {v.join(Str:lf)}]]` }
  }).join()
}

// 繰り返し実行するための関数
@play(){
  // 開始時間をシードにした乱数生成機
  let random = Math:gen_rng(Date:now())
  // リール毎のランダムな絵柄を縦3セットのmfmテキストへ変換したリスト
  let reels = idx_list.map(@(){
    // 狭い幅の絵柄が隣り合わずに入る最大開始地点のインデックス
    let max = symbols.len - (narrow.len * 2 - 1)
    // ランダムに並び替えた絵柄のリストからリールの絵柄リストを作成
    var reel = []
    for (let i, symbols.len) {
      let l = (if (i == 0) {
        symbols
      } elif (i >= max && reel.slice(0, max + 1).every(@(s){ !narrow.incl(s) })) {
        // 最大開始地点のインデックスまでに狭い幅の絵柄が入らなければ残りを広い幅の絵柄と交互にする
        if ((symbols.len - i) % 2 != 0) { narrow } else { wide }
      } elif (narrow.incl(reel[reel.len - 1])) {
        wide
      } else {
        symbols
      }).filter(@(s){ !reel.incl(s) })
      reel.push(l[random(0, l.len - 1)])
    }
    // 長さが21になるまで隣合わないようにしながらランダムな絵柄を追加する
    loop {
      // 長さが21になったらループを終了
      if (reel.len == 21) { break }
      // 最後の絵柄の絵柄リスト内インデックス
      let last_i = symbols.index_of(reel[reel.len - 1])
      // ランダムな絵柄を選ぶリスト
      let l = (if (narrow.incl(reel[reel.len - 1]) || (reel.len == 20 && narrow.incl(reel[0]))) {
        wide // リストの最後の絵柄が狭い幅であれば広い幅の範囲にする
      } else {
        symbols
      }).filter(@(s, i){
        var b = i != last_i // 最後の絵柄を除く
        if (reel.len == 20) { // 21個目の時は最初の絵柄も除く
          b = b && s != reel[0]
        }
        return b
      })
      // 絵柄を追加
      reel.push(l[random(0, l.len - 1)])
    }
    return reel.map(@(s, i){
      let rev_i = 20 - i // なんか分からんけど逆にしたら下に回ってくれる
      return idx_list.map(@(n){
        return `$[border.noclip,color=fff {reel[(rev_i + n) % reel.len]}]`
      })
    })
  })
  // リーチの情報を格納
  var reach = {
    text: "",
    x: [],
    top_bot: false,
    bot_top: false,
    reg: false,
    big: false,
  }
  // 回転カウンター
  var cnt = 0
  
  // ボタンUIを非表示
  Ui:get(buttons_id).update({ hidden: true })
  
  // リールを回転させる関数
  @spin(){
    // リーチ中フラグ
    let is_reach = reach.text != "" && !reach.text.incl(mid_result.lose)
    // 各リールのセットを格納したリスト(1秒毎にリールを左から固定、カウントを絵柄の数で割ったあまりからインデックスを取得)
    var set = idx_list.flat_map(@(x){
      return reels[x][if (cnt >= 25 && x == 0) { 25 } elif (cnt >= 50 && x == 1) { 50 } else { cnt } % symbols.len]
    })
    // 中央の絵柄部分
    let c = set[4]
    // 2秒を過ぎた時点で右リールの停止時間を調整
    if (cnt < if (reach.big) { 100 } elif (reach.reg) { 95 } elif (is_reach) { 85 } elif (cnt > 50) { 65 } else { 75 }) {
      if (cnt == 50) {
        // 2列目が停止した時にリーチを確認して表示を更新
        reach.top_bot = set[0] == c // 斜め右下がりの列
        reach.bot_top = set[2] == c // 斜め右上がりの列
        if (reach.top_bot || reach.bot_top) {
          reach.reg = c.incl(reg)
          reach.big = c.incl(big)
        }
        for (let y, 3) { // 横の列
          if (set[y] == set[y + 3]) {
            reach.x.push(y)
            reach.reg = set[y].incl(reg) || reach.reg
            reach.big = set[y].incl(big) || reach.x.len == 3 || reach.big
          }
        }
        reach.reg = reach.x.len == 2 || (reach.x.len == 1 && set[reach.x[0]] == c && (reach.top_bot || reach.bot_top)) || (reach.top_bot && set[0] == set[2]) || reach.reg
        // リーチの情報に合わせて表示するテキストを決定
        let k = if (reach.x.len > 0 || Obj:vals(reach).some(@(r){ r == true })) {
          if (reach.big) { "big" } elif (reach.reg) { "reg" } else { "hit" }
        } else { "lose" }
        reach.text = `{Str:lf}$[border.noclip,color=0000,width=3 {mid_result[k]}]`
      }
      // 右リールの停止時間まではカウントアップしながら表示を更新
      Ui:get(reels_id).update({ text: `{reels_mfm(set)}{reach.text}` })
      cnt += 1
    } else {
      // 結果を確認して表示を更新
      // キラキラmfmをつける前のセットリスト
      let set_org = set.copy()
      // 当たりカウンター
      var hit_cnt = 0
      // 結果テキストのキー(初期値はハズレ)
      var k = "lose"
      // 斜めの列を確認
      each (let l, [ [ 0, 4, 8 ], [ 2, 4, 6 ] ]) {
        if (set_org[l[0]] == c && c == set_org[l[2]]) {
          hit_cnt += 1
          k = if (c.incl(big) || k == "big") {
            "big" // 大当たり判定
          } elif (c.incl(reg) || hit_cnt == 2 || k == "reg") {
            "reg" // 中当たり絵柄と二列揃いを中当たり判定
          } else { "hit" } // 当たり判定
          // キラキラmfmを追加
          l.map(@(n){ set[n] = `$[sparkle {set_org[n]}]` })
        }
      }
      for (let y, 3) {
        // 横の列を確認
        if (reach.x.incl(y) && set_org[y + 3] == set_org[y + 6]) {
          hit_cnt += 1
          k = if ((reach.big && set[y].incl(big))|| hit_cnt == 3 || k == "big" ) {
            "big" // 大当たり絵柄と全段揃いを大当たり判定
          } elif (reach.reg && set[y].incl(reg) || hit_cnt == 2 || k == "reg") {
            "reg"  // 中当たり絵柄と二段揃いを中当たり判定
          } else { "hit" }
          [ y, y + 3, y + 6 ].map(@(n){
            set[n] = `$[sparkle {set_org[n]}]`
          })
        }
      }
      // 最大の期待に達しない結果だった時
      if (is_reach && k == "lose") {
        k = if (reach.big) { "big_fake" } elif (reach.reg) { "reg_fake" } else { "fake" }
      } elif ((reach.big || reach.reg) && k == "hit") {
        k = "g_fake_hit"
      } elif (reach.big && k == "reg") {
        k = "g_fake_reg"
      }
      // 結果テキスト
      let result_text = `{reels_mfm(set)}{Str:lf}$[border.noclip,color=0000,width=3 {result_texts[k]}]`
      // 表示を更新
      Ui:get(reels_id).update({ text: result_text })
      Ui:get(buttons_id).update({
        hidden: false,
        children: [
          Ui:C:postFormButton({
            text: "結果を投稿",
            rounded: true,
            primary: true,
            form: {
              text: `<center>{result_text}{Str:lf}[{name}]({THIS_URL})</center>`,
            },
          })
          Ui:C:button({
            text: "もう一回",
            onClick: play,
          })
        ],
      })
      // UI更新後に停止
      stop()
    }
  }
  
  // 0.78秒毎にリールを1周するループを開始
  let stop = Async:interval(780 / 21, spin, true)
}

// 基礎UI
Ui:render([
  Ui:C:container({
    align: "center",
    children: [
      Ui:C:mfm({}, reels_id)
      Ui:C:container({}, buttons_id)
    ],
  })
])

// Play開始
play()