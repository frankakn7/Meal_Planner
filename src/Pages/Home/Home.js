import React from 'react'
import PlanEditor from '../Plans/PlanEditor/PlanEditor'

const Home = (props) => {
  return (
    <div>
      <PlanEditor plans={props.plans} recipes={props.recipes} ingredients={props.ingredients} />
    </div>
  )
}

export default Home