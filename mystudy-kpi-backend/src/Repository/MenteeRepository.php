<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Mentee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Mentee>
 *
 * @method Mentee|null find($id, $lockMode = null, $lockVersion = null)
 * @method Mentee|null findOneBy(array $criteria, array $orderBy = null)
 * @method Mentee[]    findAll()
 * @method Mentee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MenteeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Mentee::class);
    }

    public function save(Mentee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Mentee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
