import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Write your code here
class GithubPopularRepos extends Component {
  state = {
    activeLanguageFilterId: languageFiltersData[0].id,
    reposList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepos()
  }

  getRepos = async () => {
    const {activeLanguageFilterId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.popular_repos.map(eachObj => ({
        name: eachObj.name,
        id: eachObj.id,
        issuesCount: eachObj.issues_count,
        forksCount: eachObj.forks_count,
        starsCount: eachObj.stars_count,
        avatarUrl: eachObj.avatar_url,
      }))
      this.setState({
        reposList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderError = () => (
    <div className="fail">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-head">Something Went Wrong</h1>
    </div>
  )

  updateActiveFilter = id => {
    this.setState({activeLanguageFilterId: id}, this.getRepos)
  }

  renderReposList = () => {
    const {reposList} = this.state

    return (
      <ul className="repo-list">
        {reposList.map(eachRepo => (
          <RepositoryItem key={eachRepo.id} repoDetails={eachRepo} />
        ))}
      </ul>
    )
  }

  renderRepos = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderReposList()
      case apiStatusConstants.failure:
        return this.renderError()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeLanguageFilterId} = this.state

    return (
      <div className="bg-cont">
        <h1 className="head">Popular</h1>
        <ul className="butt-list">
          {languageFiltersData.map(eachObj => (
            <LanguageFilterItem
              key={eachObj.id}
              isActive={eachObj.id === activeLanguageFilterId}
              onClickFilter={this.updateActiveFilter}
              filterDetails={eachObj}
            />
          ))}
        </ul>
        {this.renderRepos()}
      </div>
    )
  }
}

export default GithubPopularRepos
