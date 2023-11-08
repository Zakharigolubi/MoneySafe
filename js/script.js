import { convertStringNumber } from './convertStringNumber.js'

const financeForm = document.querySelector('.finance__form')
const financeAmount = document.querySelector('.finance__amount')

let amount = 0
financeAmount.textContent = amount

financeForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const typeOperation = e.submitter.dataset.typeOperation

  const changeAmount = Math.abs(convertStringNumber(financeForm.amount.value))

  if (typeOperation === 'income') {
    amount += changeAmount
  }
  if (typeOperation === 'expenses') {
    amount -= changeAmount
  }

  financeAmount.textContent = `${amount.toLocaleString()} ₽`
})

const financeReportBtn = document.querySelector('.finance__report')
const report = document.querySelector('.report')
financeReportBtn.addEventListener('click', () => {
  report.classList.add('report__open')
})

const reportCloseBtn = document.querySelector('.report__close')
document.addEventListener('click', (e) => {
  const clickOnTheCloseBtn = e.composedPath().includes(reportCloseBtn)
  console.log('clickOnTheCloseBtn: ', clickOnTheCloseBtn)

  if (clickOnTheCloseBtn) {
    report.classList.remove('report__open')
  }
})

// document.addEventListener('DOMContentLoaded', () => {
//   financeReportBtn.addEventListener('click', () => {
//     report.classList.add('report__open')
//   })

//   reportCloseBtn.addEventListener('click', () => {
//     report.classList.remove('report__open')
//   })
// })
