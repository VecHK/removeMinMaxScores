function collectRawData() {
  return [
    ...document.querySelectorAll("#ChartWarpper .horizontalChart .textTip"),
  ].map((texttip_node) => {
    const label_node = texttip_node.querySelector(".label")
    const count_node = texttip_node.querySelector(".count")
    return {
      label_raw: label_node.innerText,
      count_raw: count_node.innerText,
      label_node,
      count_node,
    }
  })
}
function constructData(raw_list) {
  return raw_list.map((item) => {
    return {
      score: parseInt(item.label_raw),
      count: parseInt(
        [...item.count_raw].filter((ch) => /[0-9]/.test(ch)).join("")
      ),
    }
  })
}
function calcTotalCount(score_list) {
  return score_list.reduce((count, item) => {
    return count + item.count
  }, 0)
}
function calcTotalScore(score_list) {
  return score_list.reduce((score, item) => {
    return score + (item.score * item.count)
  }, 0)
}
function removeMinMaxScores(score_list) {
  return score_list.filter((item) => {
    return !(item.score === 10 || item.score === 1)
  })
}
function calcAverage(score_list) {
  const score = calcTotalScore(score_list)
  const count = calcTotalCount(score_list)
  if (score === 0) {
    return -1
  } else if (count === 0) {
    return -1
  } else {
    return score / count
  }
}
function appendAverageScore(score) {
  let board = ""
  if ($(".SidePanel .frdScore").length === 0) {
    board = '<hr class="board">'
  }
  const score_text = score < 0 ? "无法计算" : score.toFixed(2)
  $(".SidePanel").append(
    $(
      `${board}<div class="frdScore">去掉最高/最低分的评价：<span class="num">${score_text}</span></div>`
    )
  )
}

const u = new URL(location.href)
if (/^\/subject\/[0-9]/.test(u.pathname)) {
  appendAverageScore(
    calcAverage(removeMinMaxScores(constructData(collectRawData())))
  )
}
