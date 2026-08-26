function Dish({ name, price }) {
	return (
		<article className="dish">
			<h3>{name}</h3>
			<span>{price} birr</span>
		</article>
	)
}

export default Dish
