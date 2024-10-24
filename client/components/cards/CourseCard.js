import { Card, Badge, Tooltip } from 'antd';
import Link from 'next/link';
import { currencyFormatter } from '../../utils/helpers';

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;

  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          hoverable
          className="course-card fade-in"
          cover={
            <img
              src={image.Location}
              alt={name}
              style={{ height: '200px', objectFit: 'cover' }}
              className="p-1 course-image"
            />
          }
        >
          <Meta
            title={<h2 className="course-title">{name}</h2>}
            description={
              <p className="course-instructor">by {instructor.name}</p>
            }
          />
          <div className="course-details">
            <Badge
              count={category}
              style={{ backgroundColor: '#03a9f4' }}
              className="pb-2 mr-2"
            />
            <Tooltip
              title={
                paid
                  ? `Price: ${currencyFormatter({
                      amount: price,
                      currency: 'ghs',
                    })}`
                  : 'Free'
              }
            >
              <h4 className="course-price">
                {paid
                  ? currencyFormatter({
                      amount: price,
                      currency: 'ghs',
                    })
                  : 'Free'}
              </h4>
            </Tooltip>
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
