import { FlexboxGrid, IconButton } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import VisibleIcon from '@rsuite/icons/Visible';

export default function CardItem(props) {
    return (
        <div className='card-item'>
            <FlexboxGrid className='item-header'>
                <FlexboxGrid.Item colspan={6}>card number</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>username</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid align='middle'>
                <FlexboxGrid.Item colspan={6}>
                    {props.cardnumber}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>{props.username}</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <IconButton onClick={() => { props.handleView(props.username, props.cardnumber) }} icon={<VisibleIcon />}>View</IconButton>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <IconButton
                        icon={<TrashIcon />}
                        color="red"
                        appearance="primary"
                        onClick={() => { props.handleRemove(props.username, props.cardId, props.holdername) }}
                    >
                        Remove
                    </IconButton>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}