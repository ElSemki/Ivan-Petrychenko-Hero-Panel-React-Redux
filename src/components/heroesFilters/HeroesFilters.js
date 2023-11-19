import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { heroesFilterValue } from '../../actions';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
	const { filters, filtersLoadingStatus, filterValue } = useSelector(
		state => state
	);
	const dispatch = useDispatch();

	if (filtersLoadingStatus === 'loading') {
		return <Spinner />;
	}

	if (filtersLoadingStatus === 'error') {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
	}

	const renderFilterBtns = arr => {
		if (!arr || arr.length === 0) {
			return <h5 className="text-center mt-5">Фильтров пока нет</h5>;
		}

		return arr.map(({ id, title, value, btnClassName }) => {
			const btnClass = classNames('btn', btnClassName, {
				active: value === filterValue,
			});

			return (
				<button
					onClick={() => dispatch(heroesFilterValue(value))}
					id={value}
					key={id}
					className={btnClass}
				>
					{title}
				</button>
			);
		});
	};

	const elements = renderFilterBtns(filters);

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">{elements}</div>
			</div>
		</div>
	);
};

export default HeroesFilters;
