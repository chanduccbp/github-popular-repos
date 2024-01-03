// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {filterDetails, onClickFilter, isActive} = props
  const {id, language} = filterDetails

  const onClickingFilter = () => {
    onClickFilter(id)
  }

  const filterClass = isActive ? 'a-butt' : 'butt'

  return (
    <li className="f-item">
      <button className={filterClass} onClick={onClickingFilter} type="button">
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
