import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
	filtersFetched,
	filtersFetching,
	filtersFetchingError,
	heroAdd,
} from '../../actions';
import { useHttp } from '../../hooks/http.hook';

const HeroesAddForm = () => {
	const [data, setData] = useState({ name: '', description: '', element: '' });
	const { name, description, element } = data;

	const { filters, filtersLoadingStatus } = useSelector(state => state);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(filtersFetching());
		request('http://localhost:3001/filters')
			.then(data => dispatch(filtersFetched(data)))
			.catch(() => dispatch(filtersFetchingError()));
		// eslint-disable-next-line
	}, []);

	const submitFormHandler = evt => {
		evt.preventDefault();
		if (!name || !description || !element || filtersLoadingStatus === 'error')
			return;

		const hero = { id: uuidv4(), ...data };

		request(`http://localhost:3001/heroes/`, 'POST', JSON.stringify(hero))
			.then(dispatch(heroAdd(hero)))
			.catch(e => console.error(e));

		setData({ name: '', description: '', element: '' });
	};

	const changeValueHandler = evt =>
		setData(data => ({
			...data,
			[evt.target.name === 'text' ? 'description' : evt.target.name]:
				evt.target.value,
		}));

	const renderFilters = (arr, status) => {
		if (status === 'loading') {
			return <option>Загрузка элементов</option>;
		}

		if (status === 'error') {
			return <option>Ошибка загрузки</option>;
		}

		if (!arr || arr.length === 0) {
			return <option value="">Фильтров пока нет</option>;
		}

		return arr.map(({ id, value, title }) => {
			if (value === 'all') return;
			return (
				<option key={id} value={value}>
					{title}
				</option>
			);
		});
	};

	const elements = renderFilters(filters, filtersLoadingStatus);

	return (
		<form className="border p-4 shadow-lg rounded" onSubmit={submitFormHandler}>
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">
					Имя нового героя
				</label>
				<input
					onChange={changeValueHandler}
					required
					type="text"
					name="name"
					value={name}
					className="form-control"
					id="name"
					placeholder="Как меня зовут?"
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">
					Описание
				</label>
				<textarea
					onChange={changeValueHandler}
					required
					name="text"
					value={description}
					className="form-control"
					id="text"
					placeholder="Что я умею?"
					style={{ height: '130px' }}
				/>
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">
					Выбрать элемент героя
				</label>
				<select
					onChange={changeValueHandler}
					required
					className="form-select"
					id="element"
					value={element}
					name="element"
				>
					<option>Я владею элементом...</option>
					{elements}
				</select>
			</div>

			<button type="submit" className="btn btn-primary">
				Создать
			</button>
		</form>
	);
};

export default HeroesAddForm;
