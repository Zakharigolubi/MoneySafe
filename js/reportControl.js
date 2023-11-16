import { OverlayScrollbars } from './overlayscrollbars.esm.min.js'
import { getData } from './service.js'
import { reformatDate } from './helpers.js'
import { storage } from './storage.js'

const typesOperation = {
  income: 'доход',
  expenses: 'расход'
}

const report = document.querySelector('.report')
const financeReportBtn = document.querySelector('.finance__report')
const reportTable = document.querySelector('.report__table')
const reportOperationList = document.querySelector('.report__operation-list')
const reportDates = document.querySelector('.report__dates')

OverlayScrollbars(report, {})

const closeReport = ({ target }) => {
  if (
    target.closest('.report__close') ||
    (!target.closest('.report') && target !== financeReportBtn)
  ) {
    gsap.to(report, {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete() {
        report.style.visibility = 'hidden'
      }
    })

    document.removeEventListener('click', closeReport)
  }
}

const openReport = () => {
  report.style.visibility = 'visible'

  gsap.to(report, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'power2.out'
  })

  document.addEventListener('click', closeReport)
}

const renderReport = (data) => {
  reportOperationList.textContent = ''

  const reportRows = data.map(
    ({ category, amount, description, date, type, id }) => {
      const reportRow = document.createElement('tr')
      reportRow.classList.add('report__row')

      reportRow.innerHTML = `
      <td class="report__cell">${category}</td>
      <td class="report__cell" style="text-align: right">${amount.toLocaleString()}&nbsp;₽</td>
      <td class="report__cell">${description}</td>
      <td class="report__cell">${reformatDate(date)}</td>
      <td class="report__cell">${typesOperation[type]}</td>
      <td class="report__action-cell">
        <button class="report__button report__button_table" data-del=${id}>
          &#10006;
        </button>
      </td>
    `
      return reportRow
    }
  )

  reportOperationList.append(...reportRows)
}

export const reportControl = () => {
  reportTable.addEventListener('click', ({ target }) => {
    const targetSort = target.closest('[data-sort]')

    if (targetSort) {
      const sortField = targetSort.dataset.sort
      renderReport(
        [...storage.data].sort((a, b) => {
          if (targetSort.dataset.dir === 'up') {
            ;[a, b] = [b, a]
          }

          if (sortField === 'amount') {
            return parseFloat(a[sortField]) < parseFloat(b[sortField]) ? -1 : 1
          }
          return a[sortField] < b[sortField] ? -1 : 1
        })
      )
      if (targetSort.dataset.dir === 'up') {
        targetSort.dataset.dir = 'down'
      } else {
        targetSort.dataset.dir = 'up'
      }
    }
    const targetDel = target.closest('[data-del]')
    if (targetDel) {
      console.log(targetDel.dataset.del)
    }
  })

  financeReportBtn.addEventListener('click', async () => {
    const textContent = financeReportBtn.textContent
    financeReportBtn.textContent = 'Загрузка...'
    financeReportBtn.disabled = true

    const data = await getData('/finance')
    storage.data = data

    financeReportBtn.textContent = textContent
    financeReportBtn.disabled = false

    renderReport(data)
    openReport()
  })

  reportDates.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = Object.fromEntries(new FormData(reportDates))

    const searchParams = new URLSearchParams()

    if (formData.startDate) {
      searchParams.append('startDate', formData.startDate)
    }
    if (formData.endDate) {
      searchParams.append('endDate', formData.endDate)
    }

    const queryString = searchParams.toString()

    const url = queryString ? `/finance?${queryString}` : '/finance'

    const data = await getData(url)
    renderReport(data)
  })
}
